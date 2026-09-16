import React from 'react';
import { 
  User, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';
import { StudentProfile, SubjectInfo } from '../types';
import { OFFICIAL_CURRICULUM } from '../data/curriculumData';

interface StudentDashboardProps {
  student: StudentProfile;
  onContinueSubject: (subject: SubjectInfo, level: number) => void;
  onViewBulletin: () => void;
  onChangeClass: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onContinueSubject,
  onViewBulletin,
  onChangeClass,
}) => {
  const classCurriculum = OFFICIAL_CURRICULUM[student.classId];
  let subjects: SubjectInfo[] = classCurriculum.subjects || [];

  if (student.classId === 'Terminale' && classCurriculum.series && student.serieId) {
    const s = classCurriculum.series.find(ser => ser.id === student.serieId);
    if (s) {
      subjects = s.subjects;
    }
  }

  // Calculate global stats
  let totalQuestions = 0;
  let totalCorrect = 0;
  let weightedScoresSum = 0;
  let totalCoeffs = 0;
  const allHistory: any[] = [];

  subjects.forEach(sub => {
    const key = `${student.classId}_${student.serieId || 'all'}_${sub.id}`;
    const p = student.progress[key];
    if (p) {
      totalQuestions += p.totalExercisesDone;
      totalCorrect += p.totalCorrect;
      if (p.history.length > 0) {
        weightedScoresSum += p.averageScore * sub.coefficient;
        totalCoeffs += sub.coefficient;
        allHistory.push(...p.history);
      }
    }
  });

  const generalAverage = totalCoeffs > 0 ? Math.round((weightedScoresSum / totalCoeffs) * 10) / 10 : 0;
  const overallSuccessRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Sort history by date descending
  allHistory.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Student Profile Overview Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-sm">
              {student.fullName ? student.fullName[0].toUpperCase() : 'M'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                  {student.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Mpianatra
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                {student.schoolName} • Kilasy : <span className="font-bold text-stone-900">{student.classId} {student.serieId ? `(${student.serieId})` : ''}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-dash-change-class"
              onClick={onChangeClass}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Hanova kilasy
            </button>
            <button
              id="btn-dash-view-bulletin"
              onClick={onViewBulletin}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Consulter le Bulletin Numérique</span>
            </button>
          </div>
        </div>

        {/* Quick Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-500 font-semibold block">Moyenne Générale</span>
            <span className={`text-xl sm:text-2xl font-black mt-0.5 block ${generalAverage >= 12 ? 'text-emerald-700' : generalAverage > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
              {generalAverage > 0 ? `${generalAverage} / 20` : 'En attente'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-500 font-semibold block">Questions Traitées</span>
            <span className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5 block">
              {totalQuestions}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-500 font-semibold block">Taux de Réussite</span>
            <span className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5 block">
              {overallSuccessRate}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-500 font-semibold block">Statut Actuel</span>
            <span className={`text-sm sm:text-base font-bold mt-1 block ${generalAverage >= 12 ? 'text-emerald-700' : 'text-stone-600'}`}>
              {generalAverage >= 12 ? 'VALIDÉ' : generalAverage > 0 ? 'EN COURS (Refaire < 12)' : 'Non évalué'}
            </span>
          </div>
        </div>
      </div>

      {/* Matières Progression Cards (as exemplified in Section 12) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              Fandrosoana isaky ny taranja (Progression par Matière)
            </h2>
            <p className="text-xs text-stone-500">
              Niveau actuel, Pourcentage ary Moyenne isaky ny taranja ofisialy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map(sub => {
            const key = `${student.classId}_${student.serieId || 'all'}_${sub.id}`;
            const prog = student.progress[key];

            const currentLevel = prog?.maxUnlockedLevel || 1;
            const progressPercent = prog?.progressionPercent || 10;
            const avgScore = prog?.averageScore || 0;
            const exercisesDone = prog?.totalExercisesDone || 0;

            return (
              <div
                key={sub.id}
                id={`dash-card-${sub.id}`}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs hover:border-emerald-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">
                        {sub.name}
                      </h3>
                      <span className="text-xs text-stone-500">
                        Coefficient {sub.coefficient}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Niveau {currentLevel} / 10
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="my-3">
                    <div className="flex justify-between text-xs text-stone-600 font-medium mb-1">
                      <span>Progression : {progressPercent}%</span>
                      <span className="font-bold text-stone-800">
                        Moyenne : {avgScore > 0 ? `${avgScore} / 20` : '—'}
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    {exercisesDone > 0 ? `${exercisesDone} questions complétées` : 'Tsy mbola nanomboka'}
                  </span>
                  <button
                    id={`btn-continue-${sub.id}`}
                    onClick={() => onContinueSubject(sub, currentLevel)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Continuer Niveau {currentLevel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historique des Exercices */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              Tantaran'ny fanazarana (Historique des exercices)
            </h3>
            <p className="text-xs text-stone-500">
              Ireo fanadinana sy exercices farany nataonao
            </p>
          </div>
        </div>

        {allHistory.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs">
            Mbola tsy nanao fanazarana ianao. Safidio ny taranja tianao hanombohana !
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] font-bold border-y border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Daty</th>
                  <th className="py-2.5 px-3">Taranja</th>
                  <th className="py-2.5 px-3">Niveau</th>
                  <th className="py-2.5 px-3">Naoty</th>
                  <th className="py-2.5 px-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {allHistory.slice(0, 8).map((hist, i) => (
                  <tr key={i} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 text-stone-500 whitespace-nowrap">
                      {new Date(hist.completedAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">
                      {subjects.find(s => s.id === hist.subjectId)?.name || hist.subjectId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-stone-700">
                      Niveau {hist.level}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-stone-900">
                      {hist.scoreOutOf20} / 20
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                        hist.status === 'VALIDE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {hist.status === 'VALIDE' ? 'VALIDÉ' : 'REDOUBLE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
