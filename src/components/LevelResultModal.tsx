import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  FileText, 
  Clock, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { LevelSessionResult } from '../types';

interface LevelResultModalProps {
  result: LevelSessionResult;
  onNextLevel: () => void;
  onRetryLevel: () => void;
  onGoToSubjects: () => void;
  onViewBulletin: () => void;
}

export const LevelResultModal: React.FC<LevelResultModalProps> = ({
  result,
  onNextLevel,
  onRetryLevel,
  onGoToSubjects,
  onViewBulletin,
}) => {
  const isPassed = result.status === 'VALIDE';

  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if canvas-confetti is not loaded
      }
    }
  }, [isPassed]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Flag accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="w-1/3 bg-white border-b border-stone-200" />
          <div className="w-1/3 bg-red-600" />
          <div className="w-1/3 bg-emerald-600" />
        </div>

        {/* Level & Class Info */}
        <div className="text-center mb-5">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {result.classId} {result.serieId ? `• ${result.serieId}` : ''}
          </span>
          <h3 className="text-lg font-extrabold text-stone-900 mt-1">
            Vokatry ny Fanadinana — Niveau {result.level} / 10
          </h3>
        </div>

        {/* Mandatory Official Decision Banner */}
        <div
          id="decision-banner"
          className={`p-5 rounded-2xl border-2 text-center mb-6 ${
            isPassed
              ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
              : 'bg-red-50 border-red-600 text-red-950'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {isPassed ? (
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Exact required text strings */}
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1">
            {isPassed
              ? 'VALIDÉ — Passage au niveau suivant'
              : 'REDOUBLE — Vous devez refaire ce niveau'}
          </h2>

          <p className="text-xs sm:text-sm font-medium opacity-90">
            {isPassed
              ? 'Arahabaina ! Nahatratra ny naoty takiana (farafahakeliny 12/20) ianao.'
              : 'Tsy nahatratra ny 12/20 ianao. Avereno indray ity niveau ity mandra-pahazoana 12/20 farafahakeliny.'}
          </p>
        </div>

        {/* Evaluation Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <span className="text-[11px] text-stone-500 font-semibold block">
              Moyenne
            </span>
            <span className={`text-xl font-extrabold ${isPassed ? 'text-emerald-700' : 'text-red-700'}`}>
              {result.scoreOutOf20} / 20
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <span className="text-[11px] text-stone-500 font-semibold block">
              Valiny marina
            </span>
            <span className="text-xl font-extrabold text-stone-900">
              {result.correctAnswers} / {result.totalQuestions}
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <span className="text-[11px] text-stone-500 font-semibold block">
              Fahombiazana
            </span>
            <span className="text-xl font-extrabold text-stone-900">
              {result.percentage}%
            </span>
          </div>
        </div>

        {/* Details list of questions */}
        <div className="mb-6 max-h-36 overflow-y-auto pr-1 space-y-1.5 text-xs">
          <span className="font-bold text-stone-700 block mb-1">
            Topi-maso ny valin-teninao :
          </span>
          {result.answers.map((ans, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg border flex items-center justify-between ${
                ans.isCorrect
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50/50 border-red-200 text-red-900'
              }`}
            >
              <span className="truncate max-w-[260px]">
                Q{i + 1} : {ans.questionText}
              </span>
              <span className="shrink-0 font-bold ml-2">
                {ans.isCorrect ? '+4 pts' : '0 pt'}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {isPassed ? (
            result.level < 10 ? (
              <button
                id="btn-modal-next-level"
                onClick={onNextLevel}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hiakatra amin'ny Niveau {result.level + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-modal-congrats-all"
                onClick={onViewBulletin}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5" />
                <span>Niveau 10 Vita ! Hijery ny Bulletin Numérique</span>
              </button>
            )
          ) : (
            <button
              id="btn-modal-retry-level"
              onClick={onRetryLevel}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Averina lalaovina ity Niveau ity</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id="btn-modal-back-subjects"
              onClick={onGoToSubjects}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer text-center"
            >
              Lisitry ny taranja
            </button>
            <button
              id="btn-modal-view-bulletin"
              onClick={onViewBulletin}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bulletin scolaire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
