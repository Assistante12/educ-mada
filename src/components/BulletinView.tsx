import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  GraduationCap,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { BulletinData } from '../types';

interface BulletinViewProps {
  bulletin: BulletinData;
  onBack: () => void;
}

export const BulletinView: React.FC<BulletinViewProps> = ({
  bulletin,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isPassed = bulletin.overallStatus === 'VALIDE';
  const hasGrades = bulletin.generalAverage > 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top action bar (hidden during print) */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <button
          id="btn-bulletin-back"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Miverina</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            id="btn-bulletin-pdf"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le bulletin en PDF</span>
          </button>
          <button
            id="btn-bulletin-print"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Official Bulletin Document Card */}
      <div 
        ref={printRef}
        id="official-bulletin-document"
        className="bg-white border-2 border-stone-300 rounded-3xl p-6 sm:p-10 shadow-lg print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {/* Republic of Madagascar Official Header */}
        <div className="text-center border-b-2 border-stone-800 pb-6 mb-6">
          <div className="text-xs font-serif font-black tracking-widest uppercase text-stone-900 mb-1">
            REPOBLIKAN'I MADAGASIKARA
          </div>
          <div className="text-[11px] italic font-serif text-stone-600 tracking-wider mb-2">
            Fitiavana — Tanindrazana — Fandrosoana
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
            MINISTÈRE DE L'ÉDUCATION NATIONALE
          </div>
          <div className="text-[11px] font-medium text-stone-500">
            Fandaharam-pianarana Ofisialy • Système d'Évaluation Numérique IA
          </div>

          <div className="mt-5 inline-block border-2 border-stone-900 px-6 py-2 rounded-lg bg-stone-50">
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-stone-900">
              BULLETIN SCOLAIRE NUMÉRIQUE
            </h1>
            <span className="text-xs text-stone-600 block">
              Relevé de Notes & Progression des Niveaux (1 à 10)
            </span>
          </div>
        </div>

        {/* Student identification box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 mb-6 text-xs text-stone-800">
          <div>
            <div className="mb-1.5">
              <span className="text-stone-500 font-medium">Anaran'ny mpianatra (Nom & Prénom) :</span>{' '}
              <span className="font-bold text-stone-900 text-sm block sm:inline">{bulletin.student.fullName}</span>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Toeram-pianarana (Établissement) :</span>{' '}
              <span className="font-bold text-stone-900">{bulletin.student.schoolName}</span>
            </div>
          </div>

          <div>
            <div className="mb-1.5">
              <span className="text-stone-500 font-medium">Kilasy (Classe) :</span>{' '}
              <span className="font-bold text-emerald-800 text-sm">
                {bulletin.student.classId} {bulletin.student.serieId ? `• ${bulletin.student.serieId}` : ''}
              </span>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Daty namoahana (Date d'émission) :</span>{' '}
              <span className="font-semibold text-stone-900">{bulletin.date}</span>
            </div>
          </div>
        </div>

        {/* Subjects & Grades Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-stone-800 bg-stone-100 text-stone-900 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3 border border-stone-300">Taranja (Matière)</th>
                <th className="py-2.5 px-2 text-center border border-stone-300">Coef</th>
                <th className="py-2.5 px-3 text-center border border-stone-300">Niveau Vita</th>
                <th className="py-2.5 px-3 text-center border border-stone-300">Questions</th>
                <th className="py-2.5 px-3 text-right border border-stone-300">Moyenne (/20)</th>
                <th className="py-2.5 px-3 text-center border border-stone-300">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {bulletin.subjectsSummary.map((sub, i) => (
                <tr key={i} className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 border border-stone-300 font-bold text-stone-900">
                    {sub.subjectName}
                  </td>
                  <td className="py-2.5 px-2 text-center border border-stone-300 font-semibold text-stone-700">
                    {sub.coefficient}
                  </td>
                  <td className="py-2.5 px-3 text-center border border-stone-300 font-semibold text-emerald-800">
                    Niveau {sub.currentLevel} / 10
                  </td>
                  <td className="py-2.5 px-3 text-center border border-stone-300 text-stone-600">
                    {sub.totalQuestions > 0 ? `${sub.correctAnswers}/${sub.totalQuestions}` : '0'}
                  </td>
                  <td className="py-2.5 px-3 text-right border border-stone-300 font-black text-stone-900 text-sm">
                    {sub.averageScore > 0 ? `${sub.averageScore.toFixed(1)}` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center border border-stone-300 font-bold">
                    {sub.status === 'VALIDE' ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">VALIDÉ</span>
                    ) : sub.status === 'REDOUBLE' ? (
                      <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-sm">REDOUBLE</span>
                    ) : (
                      <span className="text-stone-500">En cours</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Global Summary & Board Decision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl border-2 border-stone-300 bg-stone-50/50 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Vokatra Ankapobeny (Bilan Global)
            </span>
            <div className="space-y-1.5 text-xs text-stone-700">
              <div className="flex justify-between">
                <span>Totalin'ny fanontaniana vita :</span>
                <span className="font-bold text-stone-900">{bulletin.totalQuestionsCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span>Valiny marina :</span>
                <span className="font-bold text-emerald-700">{bulletin.totalCorrectAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span>Valiny diso :</span>
                <span className="font-bold text-red-700">
                  {bulletin.totalQuestionsCompleted - bulletin.totalCorrectAnswers}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm">
                <span className="font-extrabold text-stone-900">Moyenne Générale :</span>
                <span className={`font-black text-base ${isPassed ? 'text-emerald-700' : 'text-stone-900'}`}>
                  {bulletin.generalAverage > 0 ? `${bulletin.generalAverage.toFixed(1)} / 20` : 'En attente'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center text-center p-4 rounded-xl bg-white border border-stone-200">
            <span className="text-xs text-stone-500 font-bold uppercase tracking-wider mb-1">
              Tapaka sy Neken'ny Rafitra (Décision Officielle)
            </span>

            <div className="my-1">
              {isPassed ? (
                <div className="inline-block px-4 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-base tracking-wide">
                  VALIDÉ — ADMIS AU NIVEAU SUPÉRIEUR
                </div>
              ) : hasGrades ? (
                <div className="inline-block px-4 py-1.5 rounded-lg bg-red-100 text-red-900 border border-red-300 font-black text-base tracking-wide">
                  REDOUBLE — DOIT REFAIRE CE NIVEAU
                </div>
              ) : (
                <div className="inline-block px-4 py-1.5 rounded-lg bg-stone-100 text-stone-700 font-bold text-sm">
                  PARCOURS EN COURS D'ÉVALUATION
                </div>
              )}
            </div>

            <p className="text-[11px] text-stone-500 mt-2">
              Fepetra : Moyenne ≥ 12/20 no ahafahana miakatra amin'ny dingana manaraka.
            </p>
          </div>
        </div>

        {/* Signatures & Seal Box */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-stone-300 text-xs text-stone-700">
          <div className="text-center">
            <span className="font-bold block mb-12">Ny Mpiandraikitra ny Fampianarana</span>
            <div className="text-[10px] text-stone-400 italic">Signature & Cachet Électronique</div>
          </div>

          <div className="text-center">
            <span className="font-bold block mb-12">Le Conseil Pédagogique & MEN</span>
            <div className="text-[10px] text-emerald-700 font-mono font-bold">
              CERTIFIÉ CONFORME • MEN MADAGASCAR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
