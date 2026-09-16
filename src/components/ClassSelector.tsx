import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Check, 
  School, 
  Sparkles,
  Award,
  Compass
} from 'lucide-react';
import { GradeLevel, TerminaleSerie } from '../types';
import { OFFICIAL_CURRICULUM } from '../data/curriculumData';

interface ClassSelectorProps {
  currentClass: GradeLevel;
  currentSerie?: TerminaleSerie;
  onConfirmSelection: (grade: GradeLevel, serie?: TerminaleSerie) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  currentClass,
  currentSerie = 'Série S',
  onConfirmSelection,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(currentClass);
  const [selectedSerie, setSelectedSerie] = useState<TerminaleSerie>(currentSerie);

  const terminaleCurriculum = OFFICIAL_CURRICULUM['Terminale'];
  const terminaleSeries = terminaleCurriculum.series || [];

  const handleContinue = () => {
    onConfirmSelection(
      selectedGrade,
      selectedGrade === 'Terminale' ? selectedSerie : undefined
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Step Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          Fisafidianana ny kilasy • Choix du Parcours
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Misafidiana ny kilasinao
        </h2>
        <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto">
          Mifidiana ny kilasy misy anao mba hampisehoana ireo taranja sy exercices mifanaraka amin'ny fandaharam-pianarana ofisialy.
        </p>
      </div>

      {/* 1. Grade Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* CM2 */}
        <div
          id="select-grade-cm2"
          onClick={() => setSelectedGrade('CM2')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
            selectedGrade === 'CM2'
              ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          {selectedGrade === 'CM2' && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-sm">
              Primaire • CEPE
            </span>
            <h3 className="text-lg font-bold text-stone-900 mt-2">
              CM2
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Cours Moyen 2ème année. Fanomanana ny fanadinana voalohany CEPE.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-200/60 text-xs font-semibold text-stone-700">
            5 taranja fototra
          </div>
        </div>

        {/* 3ème */}
        <div
          id="select-grade-3eme"
          onClick={() => setSelectedGrade('3ème')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
            selectedGrade === '3ème'
              ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          {selectedGrade === '3ème' && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-sm">
              Collège • BEPC
            </span>
            <h3 className="text-lg font-bold text-stone-900 mt-2">
              Classe de 3ème
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Faran'ny kolejy. Fanomanana ny fanadinana ofisialy BEPC.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-200/60 text-xs font-semibold text-stone-700">
            7 taranja ofisialy
          </div>
        </div>

        {/* Terminale */}
        <div
          id="select-grade-terminale"
          onClick={() => setSelectedGrade('Terminale')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
            selectedGrade === 'Terminale'
              ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          {selectedGrade === 'Terminale' && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100/70 px-2 py-0.5 rounded-sm">
              Lycée • BACCALAURÉAT
            </span>
            <h3 className="text-lg font-bold text-stone-900 mt-2">
              Terminale
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Fandaharam-pianarana vaovao : Séries L, S, OSE.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-200/60 text-xs font-semibold text-stone-700">
            3 séries spécialisées
          </div>
        </div>
      </div>

      {/* 2. Series Selection (MANDATORY IF TERMINALE) */}
      {selectedGrade === 'Terminale' && (
        <div className="mb-8 p-6 bg-white border border-stone-200 rounded-2xl shadow-xs animate-in fade-in duration-200">
          <div className="mb-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Dingana faharoa • Étape 2
            </span>
            <h3 className="text-lg font-bold text-stone-900 mt-0.5">
              Safidio ny Série ho an'ny Terminale
            </h3>
            <p className="text-xs text-stone-600">
              Ny matières rehetra haseho dia hiankina amin'ny série voafidy araka ny programme officiel ankehitriny.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {terminaleSeries.map((serie) => {
              const isSelected = selectedSerie === serie.id;
              return (
                <div
                  key={serie.id}
                  id={`serie-${serie.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedSerie(serie.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900 text-sm">
                        {serie.name}
                      </h4>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                      {serie.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block mb-1.5">
                      Matières ({serie.subjects.length}) :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {serie.subjects.map(s => (
                        <span 
                          key={s.id} 
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-white text-stone-700 border border-stone-200"
                        >
                          {s.shortName} (coef {s.coefficient})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Button */}
      <div className="flex justify-center">
        <button
          id="btn-confirm-class"
          onClick={handleContinue}
          className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 text-base cursor-pointer"
        >
          <span>Hanohy amin'ireo Matières ({selectedGrade}{selectedGrade === 'Terminale' ? ` - ${selectedSerie}` : ''})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
