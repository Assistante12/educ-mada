import React from 'react';
import { X, BookOpen, ShieldCheck, CheckCircle2, Award, Landmark, FileCheck } from 'lucide-react';
import { OFFICIAL_SOURCES } from '../data/curriculumData';

interface CurriculumInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurriculumInfoModal: React.FC<CurriculumInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative">
        <button
          id="btn-close-curriculum-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Loharano sy Fandaharam-pianarana Ofisialy
            </h2>
            <p className="text-xs text-stone-500">
              Programme scolaire officiel du Ministère de l'Éducation Nationale (Madagascar)
            </p>
          </div>
        </div>

        {/* Legal & reform summary */}
        <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h3 className="font-bold text-stone-900 text-sm mb-1">
              Fanavaozana ny fandaharam-pianarana (Réformes Récentes)
            </h3>
            <p>
              Ity plateforme ity dia mifanaraka tanteraka amin'ny fandaharam-pianarana ofisialy manan-kery eto Madagasikara :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Terminale :</strong> Fampiharana ny rafitra vaovao ahitana ny <strong>Série L</strong> (Littéraire), <strong>Série S</strong> (Scientifique), ary indrindra ny <strong>Série OSE</strong> (Organisation, Société et Économie) mampiditra ny taranja SES (Sciences Économiques et Sociales) sy Mathématiques appliquées.
              </li>
              <li>
                <strong>3ème :</strong> Fanomanana ny BEPC miaraka amin'ny fitsipi-panadinana ofisialy sy ny taranja rehetra (Malagasy, Maths, PC, SVT, Français, HG/ECM, Anglais).
              </li>
              <li>
                <strong>CM2 :</strong> Fanomanana ny CEPE (Kajy, Malagasy, Frantsay, Tontolo iainana & Siansa, Tantara sy Jeografia).
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2">
              Loharano Ofisialy Nohamarinin'ny Rafitra (Sources Officielles)
            </h4>
            <div className="space-y-2">
              {OFFICIAL_SOURCES.map((src, i) => (
                <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">{src.title}</span>
                    <span className="text-[11px] text-stone-500 block">{src.authority} • {src.year}</span>
                    <span className="text-[11px] text-stone-600 italic block mt-0.5">{src.notes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm mb-2">
              Fitsipiky ny Rafitra Fanabeazana IA
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Fanontaniana 100% voamarina :</strong> marina ny fanontaniana, ny bonne réponse ary ny fomba fiasa.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>10 minutes chrono :</strong> fotoana voafetra isaky ny fanontaniana.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Règle de Passage ≥ 12/20 :</strong> naoty 12/20 no fetra ambany ahafahana miakatra niveau manaraka.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Mazava tsara (Voaray)
          </button>
        </div>
      </div>
    </div>
  );
};
