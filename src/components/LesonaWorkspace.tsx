import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileDown, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight, 
  Printer, 
  RotateCcw,
  Layers,
  BookCheck,
  Award,
  Search,
  Database,
  Languages
} from 'lucide-react';
import { GradeLevel, TerminaleSerie, SubjectInfo, LessonRemediation } from '../types';
import { OFFICIAL_CURRICULUM, LEVEL_CRITERIA } from '../data/curriculumData';
import { getCurriculumLesson, isBogusGenericLesson } from '../data/lessonData';
import { exportLessonToPdf } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import { getCachedLessonFromFirestore, saveLessonToFirestore } from '../lib/firestoreService';
import { MathText } from './MathText';

interface LesonaWorkspaceProps {
  initialGrade?: GradeLevel;
  initialSerie?: TerminaleSerie;
  initialSubjectId?: string;
  initialLevel?: number;
  onSwitchToExercises: (grade: GradeLevel, subject: SubjectInfo, level: number, serie?: TerminaleSerie) => void;
}

export const LesonaWorkspace: React.FC<LesonaWorkspaceProps> = ({
  initialGrade = 'Terminale',
  initialSerie = 'Série S',
  initialSubjectId = 'math',
  initialLevel = 1,
  onSwitchToExercises
}) => {
  const { userProfile } = useAuth();
  
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [selectedSerie, setSelectedSerie] = useState<TerminaleSerie>(initialSerie);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [selectedLevel, setSelectedLevel] = useState<number>(initialLevel);
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'mg'>('fr');

  // Current lesson state
  const [currentLesson, setCurrentLesson] = useState<LessonRemediation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [customQuestionInput, setCustomQuestionInput] = useState<string>('');
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [lessonSource, setLessonSource] = useState<'firestore_cache' | 'ai_generated' | 'curriculum_database'>('curriculum_database');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Active request tracking and fast session memory cache to avoid quota bursts
  const activeRequestRef = React.useRef<string>('');
  const sessionCacheRef = React.useRef<Map<string, LessonRemediation>>(new Map());

  // Available subjects for the current grade/serie
  const gradeCurriculum = OFFICIAL_CURRICULUM[selectedGrade];
  const availableSubjects: SubjectInfo[] = React.useMemo(() => {
    if (selectedGrade === 'Terminale' && gradeCurriculum.series) {
      const serieObj = gradeCurriculum.series.find(s => s.id === selectedSerie);
      return serieObj?.subjects || [];
    }
    return gradeCurriculum.subjects || [];
  }, [selectedGrade, selectedSerie, gradeCurriculum]);

  // Current active subject info
  const currentSubjectInfo = availableSubjects.find(s => s.id === selectedSubjectId) || availableSubjects[0];
  const isMalagasySubject = currentSubjectInfo?.id?.toLowerCase().includes('malagasy');
  const activeLang: 'fr' | 'mg' = isMalagasySubject ? 'mg' : selectedLanguage;

  // Load lesson whenever grade, serie, subject, level, or language changes
  const loadLesson = async (questionPrompt: string = '', forceAiRefresh: boolean = false) => {
    if (!currentSubjectInfo) return;

    const targetSerie = selectedGrade === 'Terminale' ? selectedSerie : undefined;
    const requestKey = `${selectedGrade}_${targetSerie || 'all'}_${currentSubjectInfo.id}_lvl${selectedLevel}_${activeLang}_${questionPrompt.trim()}_${forceAiRefresh}`;
    activeRequestRef.current = requestKey;

    // 0. Check local session memory cache first (instantaneous, 0ms)
    if (!forceAiRefresh && !questionPrompt.trim()) {
      const memoryCached = sessionCacheRef.current.get(requestKey);
      if (memoryCached && !isBogusGenericLesson(memoryCached)) {
        setCurrentLesson(memoryCached);
        setLessonSource(memoryCached.source || 'firestore_cache');
        setIsAiGenerated(memoryCached.source === 'ai_generated');
        setLoading(false);
        return;
      } else if (memoryCached) {
        sessionCacheRef.current.delete(requestKey);
      }
    }

    setLoading(true);

    // 1. Check Firebase Firestore Cache first if not forcing AI refresh and no custom query
    if (!forceAiRefresh && !questionPrompt.trim()) {
      try {
        const cachedLesson = await getCachedLessonFromFirestore(
          selectedGrade,
          currentSubjectInfo.id,
          selectedLevel,
          targetSerie,
          activeLang
        );

        if (cachedLesson && !isBogusGenericLesson(cachedLesson) && activeRequestRef.current === requestKey) {
          sessionCacheRef.current.set(requestKey, cachedLesson);
          setCurrentLesson(cachedLesson);
          setLessonSource('firestore_cache');
          setIsAiGenerated(false);
          setLoading(false);
          return;
        }
      } catch {
        // Fall through to server API or local fallback
      }
    }

    // 2. Query the server endpoint
    try {
      const res = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedGrade,
          serieId: targetSerie,
          subjectId: currentSubjectInfo.id,
          level: selectedLevel,
          language: activeLang,
          specificStruggle: questionPrompt
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.lesson && !isBogusGenericLesson(data.lesson) && activeRequestRef.current === requestKey) {
          const isAi = data.mode === 'ai_generated';
          const resolvedSource = data.mode === 'firestore_cache' ? 'firestore_cache' : isAi ? 'ai_generated' : 'curriculum_database';
          const resolvedLesson: LessonRemediation = {
            ...data.lesson,
            language: activeLang,
            source: resolvedSource
          };

          sessionCacheRef.current.set(requestKey, resolvedLesson);
          setCurrentLesson(resolvedLesson);
          setIsAiGenerated(isAi);
          setLessonSource(resolvedSource);

          // Save to Firebase Firestore so future requests are instantaneous
          if (isAi) {
            try {
              await saveLessonToFirestore(resolvedLesson);
            } catch {
              // Non-blocking firestore save
            }
          }
          return;
        }
      }
      throw new Error('Fallback required');
    } catch {
      // Offline fallback to verified curriculum database
      if (activeRequestRef.current === requestKey) {
        const fallback = getCurriculumLesson(
          selectedGrade,
          currentSubjectInfo.id,
          selectedLevel,
          targetSerie,
          activeLang
        );
        const resolvedFallback: LessonRemediation = {
          ...fallback,
          language: activeLang,
          source: 'curriculum_database'
        };
        sessionCacheRef.current.set(requestKey, resolvedFallback);
        setCurrentLesson(resolvedFallback);
        setIsAiGenerated(false);
        setLessonSource('curriculum_database');

        if (!isBogusGenericLesson(resolvedFallback)) {
          try {
            await saveLessonToFirestore(resolvedFallback);
          } catch {
            // ignore
          }
        }
      }
    } finally {
      if (activeRequestRef.current === requestKey) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.some(s => s.id === selectedSubjectId)) {
      setSelectedSubjectId(availableSubjects[0].id);
    }
  }, [selectedGrade, selectedSerie, availableSubjects, selectedSubjectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLesson();
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedGrade, selectedSerie, selectedSubjectId, selectedLevel, activeLang]);

  const handleDownloadPdf = () => {
    if (!currentLesson) return;
    exportLessonToPdf({
      lesson: currentLesson,
      studentName: userProfile?.fullName || (activeLang === 'fr' ? 'Élève Malagasy' : 'Mpianatra Malagasy'),
      schoolName: userProfile?.schoolName || (activeLang === 'fr' ? 'Établissement Scolaire' : 'Sekoly Malagasy')
    });
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestionInput.trim()) return;
    loadLesson(customQuestionInput.trim(), true);
    setCustomQuestionInput('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Mode Identifier */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-400/20 text-teal-300 rounded-full text-xs font-semibold tracking-wide uppercase border border-teal-400/30">
              <BookCheck className="w-4 h-4" />
              {activeLang === 'fr' ? 'Fiches de Cours Officielles • MEN Madagascar' : 'Workspace Lesona • Fandaharam-pianarana MEN Madagascar'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {activeLang === 'fr' 
                ? 'Fiches de Cours Pédagogiques & Remédiation Approfondie'
                : 'Workspace Lesona : Fampianarana sy Fandalinana ny Cours'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {activeLang === 'fr'
                ? 'Cours complets officiels du CEPE, BEPC et Baccalauréat. Définitions exactes, notations mathématiques normalisées (symboles professionnels « × » et « ÷ »), erreurs fréquentes analysées et exemple résolu pas à pas avec téléchargement PDF.'
                : "Takelaka lesona ofisialy isaky ny kilasy sy haavo (Niveau 1 hatramin'ny 10). Mampiasa marika matihanina (« × » sy « ÷ »), manazava ny fitsipika sy raikipohy, miaraka amin'ny fakana azy ho PDF Professionnel."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Language Switcher pill */}
            {!isMalagasySubject && (
              <div className="flex items-center bg-black/30 backdrop-blur border border-white/20 rounded-xl p-1 text-xs font-bold">
                <button
                  onClick={() => setSelectedLanguage('fr')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    selectedLanguage === 'fr' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Afficher les cours en Français"
                >
                  <span>🇫🇷 Français</span>
                </button>
                <button
                  onClick={() => setSelectedLanguage('mg')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    selectedLanguage === 'mg' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Asehoy amin'ny teny Malagasy ny lesona"
                >
                  <span>🇲🇬 Malagasy</span>
                </button>
              </div>
            )}

            {currentLesson && (
              <>
                <button
                  onClick={handleDownloadPdf}
                  id="btn-download-pdf-hero"
                  className="flex items-center gap-2 px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  title={activeLang === 'fr' ? 'Télécharger la fiche de cours officielle en PDF' : "Haka ny takelaka lesona amin'ny endrika PDF ofisialy"}
                >
                  <FileDown className="w-5 h-5" />
                  <span>{activeLang === 'fr' ? 'Télécharger PDF' : "Haka Lesona PDF"}</span>
                </button>
                <button
                  onClick={handlePrint}
                  id="btn-print-lesson-hero"
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition cursor-pointer"
                  title={activeLang === 'fr' ? 'Imprimer le cours' : "Hanonta mivantana ny lesona"}
                >
                  <Printer className="w-5 h-5" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Selector Section: Grade, Serie, Subject, Level, Language */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
        {/* Row 1: Kilasy, Serie & Language */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
              {activeLang === 'fr' ? '1. Classe' : '1. Safidio ny Kilasy (Classe)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {(['CM2', '3ème', 'Terminale'] as GradeLevel[]).map(grade => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                    selectedGrade === grade
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {selectedGrade === 'Terminale' && (
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                Série Baccalauréat
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Série L', 'Série S', 'Série OSE'] as TerminaleSerie[]).map(serie => (
                  <button
                    key={serie}
                    onClick={() => setSelectedSerie(serie)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedSerie === serie
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {serie}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Explicit Language Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
              <Languages className="w-3.5 h-3.5 inline mr-1 text-teal-600" />
              {activeLang === 'fr' ? 'Langue d\'enseignement' : 'Fiteny ampiasaina'}
            </label>
            {isMalagasySubject ? (
              <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                🇲🇬 Malagasy (Fiteny Reny)
              </span>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('fr')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedLanguage === 'fr' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇫🇷 Français
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('mg')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedLanguage === 'mg' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇲🇬 Malagasy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Taranja (Subjects) */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
            {activeLang === 'fr' ? '2. Matière (Programme Officiel MEN)' : '2. Safidio ny Taranja (Matière)'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {availableSubjects.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition cursor-pointer ${
                  currentSubjectInfo?.id === sub.id
                    ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{sub.name}</span>
                <span className="text-[11px] text-slate-600 font-medium">Coef: {sub.coefficient}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Haavo / Niveau (1 to 10) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {activeLang === 'fr' ? '3. Niveau de progression (1 à 10)' : "3. Safidio ny Haavo (Niveau 1 hatramin'ny 10)"}
            </label>
            <span className="text-xs font-medium text-teal-700">
              {LEVEL_CRITERIA[selectedLevel]?.title} ({LEVEL_CRITERIA[selectedLevel]?.description})
            </span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-500/30 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>Niv. {lvl}</span>
                <span className="text-[9px] opacity-75 font-normal">
                  {lvl <= 3 ? 'Base' : lvl <= 6 ? 'Standard' : lvl <= 8 ? 'Examen' : 'Expert'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ask IA for specific lesson explanation */}
        <form onSubmit={handleAskQuestion} className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={customQuestionInput}
              onChange={(e) => setCustomQuestionInput(e.target.value)}
              placeholder={activeLang === 'fr' 
                ? "Quel chapitre, théorème ou formule souhaitez-vous approfondir avec des exemples résolus ?"
                : "Inona ny lohateny na toko tianao hanaovan'ny IA fikarohana sy hazavaina miaraka amin'ny ohatra fampiharana?"}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !customQuestionInput.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>{activeLang === 'fr' ? 'Recherche IA' : 'Fikarohana IA'}</span>
          </button>
          <button
            type="button"
            onClick={() => loadLesson('', false)}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            title={activeLang === 'fr' ? 'Recharger le cours' : "Avereno vakiana tao amin'ny tahiry"}
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </form>
      </div>

      {/* Download Alert Notification */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-sm shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {activeLang === 'fr' 
                ? <strong>Téléchargement PDF réussi ! La fiche de cours officielle est enregistrée.</strong>
                : <strong>Vita ny fakana ny PDF ! Voatahiry soamantsara ao amin'ny fitaovanao ny Takelaka Lesona Ofisialy.</strong>}
            </span>
          </div>
        </div>
      )}

      {/* Loading Skeleton or Lesson Sheet Display */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="inline-block p-4 bg-teal-50 rounded-2xl animate-pulse">
            <BookOpen className="w-8 h-8 text-teal-600 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {activeLang === 'fr'
              ? 'Génération et recherche de la fiche de cours officielle...'
              : "Eo am-pandrafetana sy fikarohana ny lesona mifanaraka amin'ny fandaharam-pianarana..."}
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {activeLang === 'fr'
              ? `Analyse des exigences officielles du MEN Madagascar pour ${selectedGrade} (${currentSubjectInfo?.name}, Niveau ${selectedLevel})...`
              : `Hadihadiana ny fandaharam-pianaran'ny MEN Madagascar ho an'ny ${selectedGrade} (${currentSubjectInfo?.name}, Niveau ${selectedLevel})...`}
          </p>
        </div>
      ) : currentLesson ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
          {/* Document Official Header Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                Niveau {currentLesson.level} / 10
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentLesson.officialReference}
              </span>
              {lessonSource === 'firestore_cache' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-900 bg-teal-100/80 border border-teal-200 px-2.5 py-0.5 rounded-full" title="Chargé instantanément depuis Firebase Firestore">
                  <Database className="w-3 h-3 text-teal-700" /> {activeLang === 'fr' ? 'Base Firestore' : 'Tahiry Firestore'}
                </span>
              )}
              {lessonSource === 'ai_generated' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full" title="Généré par l'IA et sauvegardé dans Firestore">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> {activeLang === 'fr' ? 'Généré par IA & Enregistré' : "Nohazavain'ny IA & Voatahiry ao amin'ny Firestore"}
                </span>
              )}
              {lessonSource === 'curriculum_database' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  <BookCheck className="w-3 h-3 text-slate-600" /> {activeLang === 'fr' ? 'Base Officielle MEN' : 'Tahiry MEN Madagascar'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadLesson('', true)}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                title={activeLang === 'fr' ? 'Actualiser les explications avec l\'IA' : "Ataovy fikarohana sy fanazavana vaovao amin'ny IA indray"}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">{activeLang === 'fr' ? 'Régénérer IA' : "Havaozy amin'ny IA"}</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Core Printable Sheet Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* National Motto & Title Banner */}
            <div className="text-center space-y-1.5 pb-6 border-b border-slate-200">
              <div className="text-xs tracking-widest uppercase font-bold text-slate-700">
                REPOBLIKAN'I MADAGASIKARA
              </div>
              <div className="text-[11px] italic text-slate-600">
                Fitiavana - Tanindrazana - Fandrosoana
              </div>
              <div className="text-xs font-bold text-teal-800 uppercase">
                MINISTÈRE DE L'ÉDUCATION NATIONALE (MEN)
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
                  {activeLang === 'fr' ? 'FICHE DE COURS OFFICIELLE' : 'TAKELAKA LESONA OFISIALY'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  <MathText text={currentLesson.title} />
                </h2>
              </div>
              <div className="text-sm font-medium text-teal-700">
                {activeLang === 'fr' ? 'Thème officiel : ' : 'Thème ofisialy : '}
                <MathText text={currentLesson.theme} />
              </div>
            </div>

            {/* Section I: Objectives */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-sm tracking-wide uppercase border-l-4 border-teal-600 pl-3">
                <GraduationCap className="w-4 h-4 text-teal-700" />
                <span>
                  {activeLang === 'fr'
                    ? 'I. Objectifs du Cours & Compétences à Acquérir'
                    : "I. Tanjona sy Fahaiza-manao tratrarina (Objectifs)"}
                </span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                {currentLesson.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <MathText text={obj} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Section II: Core Lesson & Theory */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm tracking-wide uppercase border-l-4 border-blue-600 pl-3">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>
                  {activeLang === 'fr'
                    ? 'II. Cours Magistral, Définitions et Formules Officielles'
                    : "II. Ny Lesona Fototra sy ny Fanazavana (Cours Détaillé & Formules)"}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                {currentLesson.coreTheory.map((theory, idx) => (
                  <div key={idx} className="text-sm text-slate-800 leading-relaxed">
                    <MathText text={theory} />
                  </div>
                ))}
              </div>
            </div>

            {/* Section III: Erreurs fréquentes / Points de Vigilance */}
            {currentLesson.commonMistakes && currentLesson.commonMistakes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm tracking-wide uppercase border-l-4 border-amber-600 pl-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>
                    {activeLang === 'fr'
                      ? 'III. Erreurs Fréquentes et Points de Vigilance à l\'Examen'
                      : "III. Fanamarihana sy Fandrika hialana amin'ny Fanadinana"}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {currentLesson.commonMistakes.map((mistake, idx) => (
                    <div 
                      key={idx} 
                      className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2.5 transition hover:shadow-md"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[11px] font-bold shrink-0 mt-0.5">
                          {activeLang === 'fr' ? `Piège #${idx + 1}` : `Fandrika #${idx + 1}`}
                        </span>
                        <h4 className="text-sm font-bold text-amber-950">
                          <MathText text={mistake.mistake} />
                        </h4>
                      </div>

                      <div className="pl-0 sm:pl-8 space-y-1.5 text-xs sm:text-sm">
                        <p className="text-slate-700">
                          <strong className="text-slate-900">{activeLang === 'fr' ? 'Explication : ' : 'Fanazavana : '}</strong>
                          <MathText text={mistake.explanation} />
                        </p>
                        <div className="bg-white border border-emerald-300 rounded-xl p-3 flex items-start gap-2 text-emerald-900 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-emerald-950 font-bold">{activeLang === 'fr' ? 'Bonne pratique / Correction : ' : 'Fomba fiasa marina : '}</strong>
                            <MathText text={mistake.correction} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section IV: Methodology */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm tracking-wide uppercase border-l-4 border-purple-600 pl-3">
                <Layers className="w-4 h-4 text-purple-700" />
                <span>
                  {activeLang === 'fr'
                    ? 'IV. Méthodologie de Résolution Pas à Pas'
                    : "IV. Fomba Fiasa Dingana Manaraka (Méthodologie Pas à Pas)"}
                </span>
              </div>
              <div className="space-y-2">
                {currentLesson.methodology.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-purple-50/50 border border-purple-100 rounded-xl p-3 text-sm text-purple-950">
                    <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">
                      <MathText text={step} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section V: Solved Example */}
            {currentLesson.solvedExample && currentLesson.solvedExample.problem && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm tracking-wide uppercase border-l-4 border-emerald-600 pl-3">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>
                    {activeLang === 'fr'
                      ? 'V. Exemple d\'Application Résolu Pas à Pas'
                      : "V. Ohatra Fampiharana Voavaha amin'ny Antsipiriany"}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                      {activeLang === 'fr' ? 'Énoncé d\'application :' : 'Fanontaniana fampiharana :'}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      <MathText text={currentLesson.solvedExample.problem} />
                    </div>
                  </div>

                  <div className="space-y-2 pl-2">
                    <div className="text-xs font-bold text-slate-500 uppercase">
                      {activeLang === 'fr' ? 'Étapes de résolution :' : 'Dingana famahana :'}
                    </div>
                    {currentLesson.solvedExample.steps.map((st, idx) => (
                      <div key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>
                          <MathText text={st} />
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-950 font-bold">
                    <span>{activeLang === 'fr' ? 'Réponse finale : ' : 'Valiny ofisialy : '}</span>
                    <MathText text={currentLesson.solvedExample.finalAnswer} />
                  </div>
                </div>
              </div>
            )}

            {/* Section VI: Key Takeaways */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2 shadow-sm">
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                {activeLang === 'fr'
                  ? '★ Points Clés du Cours à Retenir pour l\'Examen :'
                  : "★ Famintinana ny Lesona Hotadidina (Points Clés) :"}
              </div>
              <ul className="space-y-1.5 pl-2">
                {currentLesson.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-200 font-medium flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <MathText text={takeaway} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Action: Test knowledge in Exercise Mode */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                {activeLang === 'fr'
                  ? 'Prêt à vérifier votre compréhension avec les exercices officiels ?'
                  : "Vonona hampihatra ity lesona ity amin'ny fanazaran-tena ve ianao ?"}
              </div>
              {currentSubjectInfo && (
                <button
                  onClick={() => onSwitchToExercises(
                    selectedGrade,
                    currentSubjectInfo,
                    selectedLevel,
                    selectedGrade === 'Terminale' ? selectedSerie : undefined
                  )}
                  id="btn-switch-to-exercises"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{activeLang === 'fr' ? 'Passer aux Exercices de ce Cours' : "Hanao Fanazaran-tena amin'ity Lesona ity"}</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LesonaWorkspace;
