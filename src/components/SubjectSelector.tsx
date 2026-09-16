import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  ArrowRight, 
  BookOpen, 
  Calculator, 
  Atom, 
  Dna, 
  Languages, 
  Landmark, 
  Globe, 
  BrainCircuit, 
  TrendingUp, 
  BarChart3, 
  Sprout, 
  MapPin, 
  Binary,
  CheckCircle2,
  ChevronRight,
  Flame,
  Star,
  Award,
  ShieldCheck,
  Palette,
  Leaf,
  Laptop,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { GradeLevel, TerminaleSerie, SubjectInfo, StudentProfile } from '../types';
import { OFFICIAL_CURRICULUM, LEVEL_CRITERIA } from '../data/curriculumData';

interface SubjectSelectorProps {
  grade: GradeLevel;
  serie?: TerminaleSerie;
  student: StudentProfile;
  onChangeClass: () => void;
  onSelectSerie?: (serie: TerminaleSerie) => void;
  onSelectLevelToPlay: (subject: SubjectInfo, level: number) => void;
}

// Map string icon names to Lucide icons
const iconMap: Record<string, React.ElementType> = {
  Calculator,
  BookOpen,
  Languages,
  Sprout,
  MapPin,
  Binary,
  Atom,
  Dna,
  Landmark,
  Globe,
  BrainCircuit,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Palette,
  Leaf,
  Laptop
};

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  grade,
  serie: initialSerie,
  student,
  onChangeClass,
  onSelectSerie,
  onSelectLevelToPlay,
}) => {
  const [currentSerie, setCurrentSerie] = useState<TerminaleSerie>(
    initialSerie || student.serieId || 'Série S'
  );

  const classCurriculum = OFFICIAL_CURRICULUM[grade];
  let subjects: SubjectInfo[] = classCurriculum.subjects || [];

  if (grade === 'Terminale' && classCurriculum.series) {
    const s = classCurriculum.series.find(ser => ser.id === currentSerie);
    if (s) {
      subjects = s.subjects;
    }
  }

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || ''
  );

  // If the current selected subject isn't in this serie, default to first subject
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const handleSerieClick = (newSerie: TerminaleSerie) => {
    setCurrentSerie(newSerie);
    if (onSelectSerie) {
      onSelectSerie(newSerie);
    }
    // Update selected subject to first subject of new serie
    const newClassCurriculum = OFFICIAL_CURRICULUM['Terminale'];
    const s = newClassCurriculum?.series?.find(ser => ser.id === newSerie);
    if (s && s.subjects.length > 0) {
      setSelectedSubjectId(s.subjects[0].id);
    }
  };

  // Retrieve current subject progress from student record
  const effectiveSerie = grade === 'Terminale' ? currentSerie : undefined;
  const subjectKey = `${grade}_${effectiveSerie || 'all'}_${selectedSubject?.id}`;
  const subjectProg = student.progress[subjectKey] || {
    subjectId: selectedSubject?.id,
    currentLevel: 1,
    maxUnlockedLevel: 1,
    totalExercisesDone: 0,
    totalCorrect: 0,
    levelScores: {},
    subjectTotalScore: 0,
    averageScore: 0,
    progressionPercent: 10,
    history: []
  };

  const maxUnlocked = subjectProg.maxUnlockedLevel || 1;
  const subjectScoreOutOf20 = subjectProg.subjectTotalScore ?? subjectProg.averageScore ?? 0;
  const isSubjectPassed = subjectScoreOutOf20 >= 12;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Current selection banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            {grade === 'Terminale' ? 'Tle' : grade}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-extrabold text-stone-900">
                {classCurriculum.label}
              </h2>
              {grade === 'Terminale' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                  {currentSerie}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-100 text-stone-600">
                Programme MEN 2026
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {classCurriculum.examName}
            </p>
          </div>
        </div>

        <button
          id="btn-change-class"
          onClick={onChangeClass}
          className="text-xs font-semibold text-stone-600 hover:text-emerald-700 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
        >
          Hanova kilasy
        </button>
      </div>

      {/* DINGANA 1: SÉRIE SELECTOR FOR TERMINALE */}
      {grade === 'Terminale' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wide">
                Dingana 1 : Safidio ny Série-nao (Terminale)
              </h3>
            </div>
            <span className="text-xs text-stone-500">Kitiho ny Série tianao hianarana</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'Série L' as TerminaleSerie,
                label: 'Série L (Littéraire)',
                desc: 'Philo, Malagasy, Français, Histoire-Géo, Anglais, EAC, TICE...',
                badge: 'Fahaizana Teny & Haisoratra'
              },
              {
                id: 'Série S' as TerminaleSerie,
                label: 'Série S (Scientifique)',
                desc: 'Maths, Physique-Chimie, SVT, Philo, EAC, TICE...',
                badge: 'Siansa & Kajy Lalina'
              },
              {
                id: 'Série OSE' as TerminaleSerie,
                label: 'Série OSE (Économie)',
                desc: 'SES, Maths OSE, Histoire-Géo, Philo, EAC, TICE...',
                badge: 'Fitantanana & Toekarena'
              }
            ].map((sOption) => {
              const isSelected = currentSerie === sOption.id;
              return (
                <button
                  key={sOption.id}
                  id={`btn-select-serie-${sOption.id.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleSerieClick(sOption.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/30 shadow-xs'
                      : 'bg-stone-50/60 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-black ${isSelected ? 'text-emerald-900' : 'text-stone-800'}`}>
                      {sOption.label}
                    </span>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-stone-400">Safidio</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1 mb-2">
                    {sOption.desc}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-white border border-stone-200 text-stone-600 self-start">
                    {sOption.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main split view: Subject list on Left, Level progress on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Subjects list */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center gap-2">
              {grade === 'Terminale' && (
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                {grade === 'Terminale' ? 'Dingana 2 : Safidio ny Matière' : 'Safidio ny Taranja (Matière)'} ({subjects.length})
              </span>
            </div>
            <span className="text-xs text-stone-500">
              Naoty / 20
            </span>
          </div>

          {subjects.map((sub) => {
            const Icon = iconMap[sub.iconName] || BookOpen;
            const isSelected = sub.id === selectedSubject?.id;
            const subKey = `${grade}_${effectiveSerie || 'all'}_${sub.id}`;
            const prog = student.progress[subKey];
            const unlockedLvl = prog?.maxUnlockedLevel || 1;
            const totalScore = prog ? (prog.subjectTotalScore ?? prog.averageScore ?? 0) : null;

            return (
              <div
                key={sub.id}
                id={`btn-subject-${sub.id}`}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-600 shadow-2xs ring-1 ring-emerald-600/30'
                    : 'bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-stone-900 truncate">
                        {sub.name}
                      </h4>
                      {sub.isNew && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-amber-100 text-amber-900 border border-amber-300 shrink-0 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                          Vaovao
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span>Coef {sub.coefficient}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">
                        Niveau {unlockedLvl}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {totalScore !== null && totalScore > 0 ? (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                      totalScore >= 12 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {totalScore}/20
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400 font-medium">0/20</span>
                  )}
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-stone-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Selected Subject Details & 10 Levels */}
        <div className="lg:col-span-8">
          {selectedSubject && (
            <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              {/* Subject Header */}
              <div className="border-b border-stone-100 pb-5 mb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-stone-900">
                      {selectedSubject.name}
                    </h3>
                    {selectedSubject.isNew && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        Matière Vaovao (9 Septambra 2026)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md">
                      Coefficient : {selectedSubject.coefficient}
                    </span>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                      Niveau ankehitriny : {maxUnlocked} / 10
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                  {selectedSubject.description}
                </p>

                {/* Themes pills */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubject.themes.map((theme, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-sm"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              {/* MANDATORY OFFICIAL SCORING BANNER: 10 LEVELS = 20 POINTS */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-stone-50 border border-emerald-200 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                      Totalin'ny Naoty amin'ity Taranja ity (Matière)
                    </span>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Misy 10 niveau ity taranja ity. Ny fitambaran'ny isa azo amin'ireo niveau 10 ireo (2 points isaky ny niveau) no manome ny naoty amin'ny 20 (/20).
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-2xl font-black ${isSubjectPassed ? 'text-emerald-700' : 'text-stone-800'}`}>
                      {subjectScoreOutOf20}
                    </span>
                    <span className="text-sm font-bold text-stone-500"> / 20</span>
                    <span className={`block text-[10px] font-bold ${isSubjectPassed ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isSubjectPassed ? 'VALIDÉ (≥ 12/20)' : 'EN COURS (< 12/20)'}
                    </span>
                  </div>
                </div>

                {/* Progress bar towards /20 */}
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden relative">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subjectScoreOutOf20 / 20) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-semibold mt-1.5">
                  <span>0 pt</span>
                  <span className="text-emerald-800 font-bold">Fepetra hahafahana : 12 / 20</span>
                  <span>20 pts</span>
                </div>
              </div>

              {/* Levels Header & Rule Reminder */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Ireo Niveau 1 hatramin'ny 10 (2 points isaky ny niveau)
                  </h4>
                  <p className="text-xs text-stone-500">
                    Mila mahazo farafahakeliny 1.2 / 2 pts (60%) mba hidirana amin'ny niveau manaraka.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md self-start sm:self-auto">
                  Seuil de passage : ≥ 1.2 / 2 pts
                </div>
              </div>

              {/* Levels Grid (1 to 10) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).map((lvl) => {
                  const isUnlocked = lvl <= maxUnlocked;
                  const isCompleted = lvl < maxUnlocked;
                  const isCurrent = lvl === maxUnlocked;
                  const criteria = LEVEL_CRITERIA[lvl];
                  
                  // Score for this level (out of 2 pts)
                  const lvlScore = subjectProg.levelScores?.[lvl] ?? (isCompleted ? 2 : 0);
                  const isLevelValidated = lvlScore >= 1.2;

                  return (
                    <div
                      key={lvl}
                      id={`level-card-${lvl}`}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-600/30'
                          : isLevelValidated
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : isUnlocked
                          ? 'border-stone-200 bg-stone-50/60'
                          : 'border-stone-200 bg-stone-100/50 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white'
                                  : isLevelValidated
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {lvl}
                            </span>
                            <span className="text-xs font-bold text-stone-900">
                              Niveau {lvl}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Score pill for this level */}
                            {isUnlocked && (
                              <span className={`text-[11px] font-black px-2 py-0.5 rounded-sm ${
                                isLevelValidated
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : lvlScore > 0
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-stone-100 text-stone-600 border border-stone-200'
                              }`}>
                                {lvlScore} / 2 pts
                              </span>
                            )}
                            {isUnlocked ? (
                              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-stone-400" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-white border border-stone-200 text-stone-600">
                            {criteria.badge}
                          </span>
                          {isLevelValidated && (
                            <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Voamarina
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-stone-600 leading-snug mb-3">
                          {criteria.description}
                        </p>
                      </div>

                      {/* Action button */}
                      <div>
                        {isUnlocked ? (
                          <button
                            id={`btn-play-level-${lvl}`}
                            onClick={() => onSelectLevelToPlay(selectedSubject, lvl)}
                            className={`w-full py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isCurrent
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                                : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300'
                            }`}
                          >
                            <span>{lvlScore > 0 ? 'Averina lalaovina (Hanatsarana isa)' : `Manomboka ny Niveau ${lvl}`}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="py-2 px-3 rounded-lg bg-stone-200 text-stone-500 text-center text-xs font-medium cursor-not-allowed flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Mbola mihidy (Mila ≥ 1.2 pts amin'ny N{lvl - 1})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
