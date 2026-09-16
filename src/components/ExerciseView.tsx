import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  AlertCircle, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  RotateCcw,
  Loader2,
  ShieldCheck,
  Award
} from 'lucide-react';
import { GradeLevel, TerminaleSerie, SubjectInfo, Question, AnswerRecord, LevelSessionResult } from '../types';
import { getCurriculumFallbackQuestion } from '../data/curriculumData';

interface ExerciseViewProps {
  grade: GradeLevel;
  serie?: TerminaleSerie;
  subject: SubjectInfo;
  level: number;
  onSessionComplete: (result: LevelSessionResult) => void;
  onQuit: () => void;
}

const TOTAL_QUESTIONS_PER_SESSION = 5;
const QUESTION_TIMEOUT_SECONDS = 600; // 10 minutes maximum

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  grade,
  serie,
  subject,
  level,
  onSessionComplete,
  onQuit,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIMEOUT_SECONDS);
  const [answersRecord, setAnswersRecord] = useState<AnswerRecord[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSeedFallback, setIsSeedFallback] = useState<boolean>(false);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch question from backend (AI or verified seed)
  const fetchQuestion = async (qIndex: number, currentUsedIds: string[]) => {
    setLoadingQuestion(true);
    setSelectedOption(null);
    setHasSubmitted(false);
    setIsTimedOut(false);
    setTimeLeft(QUESTION_TIMEOUT_SECONDS);
    setErrorMsg(null);
    setIsSeedFallback(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s safety timeout

      const res = await fetch('/api/exercises/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: grade,
          serieId: serie,
          subjectId: subject.id,
          level,
          previousQuestionIds: currentUsedIds,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.question) {
        setCurrentQuestion(data.question);
        setUsedQuestionIds(prev => [...prev, data.question.id]);
        if (data.mode === 'curriculum_fallback' || data.mode === 'curriculum_seed') {
          setIsSeedFallback(true);
        }
      } else {
        throw new Error('Format de question non valide');
      }
    } catch (err: any) {
      console.warn('Backend question fetch unavailable, loading verified official curriculum question:', err);
      // Graceful client fallback: never block student with error
      try {
        const fallbackQ = getCurriculumFallbackQuestion(grade, subject.id, level, serie, currentUsedIds);
        setCurrentQuestion(fallbackQ);
        setUsedQuestionIds(prev => [...prev, fallbackQ.id]);
        setIsSeedFallback(true);
      } catch (fallbackError) {
        console.error('All question sources failed:', fallbackError);
        setErrorMsg('Tsy afaka nampiditra fanontaniana. Tsindrio ny bokotra avereno.');
      }
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchQuestion(0, []);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [subject.id, level]);

  // Countdown timer logic (10:00 per question)
  useEffect(() => {
    if (loadingQuestion || hasSubmitted || isTimedOut) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loadingQuestion, hasSubmitted, isTimedOut, currentIndex]);

  // Handle timeout (10:00 expired)
  const handleTimeOut = () => {
    if (hasSubmitted || !currentQuestion) return;
    setIsTimedOut(true);
    setHasSubmitted(true);
    setSelectedOption(-1); // -1 signifies unanswered / timed out

    const record: AnswerRecord = {
      id: 'ans_' + Date.now(),
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      selectedOptionIndex: -1,
      correctOptionIndex: currentQuestion.correctIndex,
      isCorrect: false,
      timeUsedSeconds: QUESTION_TIMEOUT_SECONDS,
      level,
      subjectId: subject.id,
      subjectName: subject.name,
      classId: grade,
      serieId: serie,
      date: new Date().toISOString(),
    };

    setAnswersRecord((prev) => [...prev, record]);
  };

  // Student manual submission
  const handleSubmitAnswer = () => {
    if (selectedOption === null || hasSubmitted || !currentQuestion) return;
    setHasSubmitted(true);

    const timeUsed = QUESTION_TIMEOUT_SECONDS - timeLeft;
    const isCorrect = selectedOption === currentQuestion.correctIndex;

    const record: AnswerRecord = {
      id: 'ans_' + Date.now(),
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      selectedOptionIndex: selectedOption,
      correctOptionIndex: currentQuestion.correctIndex,
      isCorrect,
      timeUsedSeconds: timeUsed,
      level,
      subjectId: subject.id,
      subjectName: subject.name,
      classId: grade,
      serieId: serie,
      date: new Date().toISOString(),
    };

    setAnswersRecord((prev) => [...prev, record]);
  };

  // Move to next question or complete session
  const handleNext = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < TOTAL_QUESTIONS_PER_SESSION) {
      setCurrentIndex(nextIndex);
      fetchQuestion(nextIndex, usedQuestionIds);
    } else {
      // Complete session! Submit to backend for certified scoring
      try {
        const res = await fetch('/api/exercises/submit-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classId: grade,
            serieId: serie,
            subjectId: subject.id,
            level,
            answers: answersRecord,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          onSessionComplete(data.result);
        } else {
          // Fallback client side calculation
          computeAndFinishLocally();
        }
      } catch (e) {
        computeAndFinishLocally();
      }
    }
  };

  const computeAndFinishLocally = () => {
    const correctCount = answersRecord.filter(a => a.isCorrect).length;
    const scoreOutOf20 = Math.round(((correctCount / answersRecord.length) * 20) * 10) / 10;
    const percentage = Math.round((correctCount / answersRecord.length) * 100);
    const status: 'VALIDE' | 'REDOUBLE' = scoreOutOf20 >= 12 ? 'VALIDE' : 'REDOUBLE';

    const fallbackResult: LevelSessionResult = {
      classId: grade,
      serieId: serie,
      subjectId: subject.id,
      level,
      totalQuestions: answersRecord.length,
      correctAnswers: correctCount,
      incorrectAnswers: answersRecord.length - correctCount,
      scoreOutOf20,
      percentage,
      status,
      completedAt: new Date().toISOString(),
      answers: answersRecord,
    };
    onSessionComplete(fallbackResult);
  };

  // Format time mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeCritical = timeLeft <= 120; // under 2 minutes warning

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Exercise Session Top Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-sm">
                Niveau {level} / 10
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {grade} {serie ? `• ${serie}` : ''}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
              {subject.name}
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            {/* Progress counter */}
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Question</span>
              <span className="text-sm font-extrabold text-stone-900">
                {currentIndex + 1} / {TOTAL_QUESTIONS_PER_SESSION}
              </span>
            </div>

            {/* Prominent 10-minute timer */}
            <div
              id="timer-badge"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
                isTimeCritical
                  ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                  : 'bg-stone-100 text-stone-800 border-stone-200'
              }`}
            >
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-red-600' : 'text-stone-500'}`} />
              <span>{formattedTime}</span>
            </div>

            <button
              id="btn-quit-exercise"
              onClick={onQuit}
              className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              Hiala
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{
              width: `${((currentIndex + (hasSubmitted ? 1 : 0)) / TOTAL_QUESTIONS_PER_SESSION) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      {loadingQuestion ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-stone-900">
            Mamolavola ny fanontaniana ny rafitra IA...
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Fanamarinana ny fanontaniana sy ny valiny mifanaraka amin'ny fandaharam-pianarana ofisialy MEN Madagascar.
          </p>
        </div>
      ) : errorMsg ? (
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center shadow-xs">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-800 mb-4">{errorMsg}</p>
          <button
            onClick={() => fetchQuestion(currentIndex, usedQuestionIds)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Avereno indray
          </button>
        </div>
      ) : currentQuestion ? (
        <div className="space-y-6">
          {/* Question Box */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            {/* Theme & Source & Status Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Thème : {currentQuestion.theme}
                </span>
                {isSeedFallback ? (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    Tahiry Voamarina MEN
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    Novokarin'ny IA mivantana
                  </span>
                )}
              </div>
              <span className="text-stone-600 italic">
                Loharano : {currentQuestion.source}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-relaxed mb-6">
              {currentQuestion.question}
            </h3>

            {/* Timeout alert banner */}
            {isTimedOut && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs font-semibold">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  Tapitra ny 10 minutes ! Nambara ho tsy voavaly (0 pt) ity fanontaniana ity. Jereo eto ambany ny valiny marina sy ny fanazavana.
                </div>
              </div>
            )}

            {/* Options List [A, B, C, D] */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let optionStyle = 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50';
                if (hasSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-600';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-red-500 bg-red-50 text-red-950';
                  } else {
                    optionStyle = 'border-stone-200 bg-stone-50/50 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600';
                }

                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <div
                    key={idx}
                    id={`option-card-${idx}`}
                    onClick={() => {
                      if (!hasSubmitted) {
                        setSelectedOption(idx);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          hasSubmitted && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : hasSubmitted && isSelected && !isCorrect
                            ? 'bg-red-600 text-white'
                            : isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {optionLetters[idx]}
                      </span>
                      <span className="text-sm font-medium leading-normal">
                        {opt}
                      </span>
                    </div>

                    {hasSubmitted && (
                      <div className="shrink-0 ml-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isSelected && !isCorrect ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Validation Button before submit */}
            {!hasSubmitted && (
              <div className="mt-6 flex justify-end">
                <button
                  id="btn-submit-answer"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                    selectedOption !== null
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>Hamarinina ny valiny</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Immediate Result & Method / Pedagogical Explanation */}
            {hasSubmitted && (
              <div className="mt-8 pt-6 border-t border-stone-200 animate-in fade-in duration-200">
                <div className={`p-5 rounded-xl mb-6 border ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                    {selectedOption === currentQuestion.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Marina ny valinteninao ! Bravo !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span>
                          {isTimedOut ? 'Tapitra ny fotoana.' : 'Misy diso ny valinteninao.'} Ny valiny marina dia ny safidy : {['A', 'B', 'C', 'D'][currentQuestion.correctIndex]}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Pedagogical resolution method */}
                  <div className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-800 bg-white/80 p-4 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">
                      Fanazavana sy Fomba Fiasa (Méthode de résolution) :
                    </span>
                    <p className="whitespace-pre-line">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>

                {/* Next button */}
                <div className="flex justify-end">
                  <button
                    id="btn-next-question"
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {currentIndex + 1 < TOTAL_QUESTIONS_PER_SESSION
                        ? 'Fanontaniana manaraka'
                        : 'Hijery ny vokatry ny Niveau'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
