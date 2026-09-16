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
  Award
} from 'lucide-react';
import { GradeLevel, TerminaleSerie, SubjectInfo, StudentProfile } from '../types';
import { OFFICIAL_CURRICULUM, LEVEL_CRITERIA } from '../data/curriculumData';

interface SubjectSelectorProps {
  grade: GradeLevel;
  serie?: TerminaleSerie;
  student: StudentProfile;
  onChangeClass: () => void;
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
  BarChart3
};

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  grade,
  serie,
  student,
  onChangeClass,
  onSelectLevelToPlay,
}) => {
  const classCurriculum = OFFICIAL_CURRICULUM[grade];
  let subjects: SubjectInfo[] = classCurriculum.subjects || [];

  if (grade === 'Terminale' && classCurriculum.series && serie) {
    const s = classCurriculum.series.find(ser => ser.id === serie);
    if (s) {
      subjects = s.subjects;
    }
  }

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || ''
  );

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Retrieve current subject progress from student record
  const subjectKey = `${grade}_${serie || 'all'}_${selectedSubject?.id}`;
  const subjectProg = student.progress[subjectKey] || {
    subjectId: selectedSubject?.id,
    currentLevel: 1,
    maxUnlockedLevel: 1,
    totalExercisesDone: 0,
    totalCorrect: 0,
    averageScore: 0,
    progressionPercent: 10,
    history: []
  };

  const maxUnlocked = subjectProg.maxUnlockedLevel || 1;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Current selection banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            {grade === 'Terminale' ? 'Tle' : grade}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-stone-900">
                {classCurriculum.label}
              </h2>
              {serie && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                  {serie}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              {classCurriculum.examName}
            </p>
          </div>
        </div>

        <button
          id="btn-change-class"
          onClick={onChangeClass}
          className="text-xs font-semibold text-stone-600 hover:text-emerald-700 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
        >
          Hanova kilasy na série
        </button>
      </div>

      {/* Main split view: Subject list on Left, Level progress on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Subjects list */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Matières ofisialy ({subjects.length})
            </span>
            <span className="text-xs text-stone-600">
              Safidio ny taranja
            </span>
          </div>

          {subjects.map((sub) => {
            const Icon = iconMap[sub.iconName] || BookOpen;
            const isSelected = sub.id === selectedSubject?.id;
            const subKey = `${grade}_${serie || 'all'}_${sub.id}`;
            const prog = student.progress[subKey];
            const unlockedLvl = prog?.maxUnlockedLevel || 1;
            const avg = prog ? prog.averageScore : null;

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
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {sub.name}
                    </h4>
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
                  {avg !== null && avg > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                      avg >= 12 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {avg}/20
                    </span>
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
                  <h3 className="text-xl font-bold text-stone-900">
                    {selectedSubject.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md">
                      Coefficient : {selectedSubject.coefficient}
                    </span>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                      Niveau ankehitriny : {maxUnlocked} / 10
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {selectedSubject.description}
                </p>

                {/* Themes pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
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

              {/* Levels Header & Rule Reminder */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Ireo Niveau 1 hatramin'ny 10
                  </h4>
                  <p className="text-xs text-stone-500">
                    Mila mahazo farafahakeliny 12/20 mba hidirana amin'ny niveau manaraka.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                  Règle : Moyenne ≥ 12/20 = VALIDÉ
                </div>
              </div>

              {/* Levels Grid (1 to 10) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).map((lvl) => {
                  const isUnlocked = lvl <= maxUnlocked;
                  const isCompleted = lvl < maxUnlocked;
                  const isCurrent = lvl === maxUnlocked;
                  const criteria = LEVEL_CRITERIA[lvl];

                  return (
                    <div
                      key={lvl}
                      id={`level-card-${lvl}`}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-600/30'
                          : isCompleted
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
                                  : isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              {lvl}
                            </span>
                            <span className="text-xs font-bold text-stone-900">
                              Niveau {lvl}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-white border border-stone-200 text-stone-600">
                              {criteria.badge}
                            </span>
                            {isUnlocked ? (
                              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-stone-400" />
                            )}
                          </div>
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
                            <span>{isCompleted ? 'Averina lalaovina' : 'Manomboka ny Niveau'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="py-2 px-3 rounded-lg bg-stone-200 text-stone-500 text-center text-xs font-medium cursor-not-allowed flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Mbola mihidy (Valider le N{lvl - 1})</span>
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
