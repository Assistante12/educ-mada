import React, { useState } from 'react';
import { X, User, School, GraduationCap, Check } from 'lucide-react';
import { GradeLevel, TerminaleSerie, StudentProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onSave: (fullName: string, schoolName: string, classId: GradeLevel, serieId?: TerminaleSerie) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave,
}) => {
  const [fullName, setFullName] = useState(student.fullName);
  const [schoolName, setSchoolName] = useState(student.schoolName);
  const [classId, setClassId] = useState<GradeLevel>(student.classId);
  const [serieId, setSerieId] = useState<TerminaleSerie>(student.serieId || 'Série S');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      fullName.trim() || 'Mpianatra Malagasy',
      schoolName.trim() || 'Lycée / Collège Madagascar',
      classId,
      classId === 'Terminale' ? serieId : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-md w-full p-6 sm:p-8 relative">
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Mombamomba ny Mpianatra
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Ampidiro ny mombamomba anao mba hisoratra ao amin'ny Bulletin Scolaire sy ny fandrosoanao.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Anarana feno (Nom & Prénom)
            </label>
            <input
              type="text"
              id="input-student-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ohatra : RABE Andry"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Sekoly na Toeram-pianarana
            </label>
            <input
              type="text"
              id="input-school-name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Ohatra : Lycée JJ Rabearivelo"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Kilasy (Classe)
            </label>
            <select
              id="select-student-class"
              value={classId}
              onChange={(e) => setClassId(e.target.value as GradeLevel)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            >
              <option value="CM2">CM2 (CEPE)</option>
              <option value="3ème">3ème (BEPC)</option>
              <option value="Terminale">Terminale (Baccalauréat)</option>
            </select>
          </div>

          {classId === 'Terminale' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Série (Terminale)
              </label>
              <select
                id="select-student-serie"
                value={serieId}
                onChange={(e) => setSerieId(e.target.value as TerminaleSerie)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Série L">Série L (Littéraire)</option>
                <option value="Série S">Série S (Scientifique)</option>
                <option value="Série OSE">Série OSE (Organisation, Société et Économie)</option>
              </select>
            </div>
          )}

          <div className="pt-3">
            <button
              type="submit"
              id="btn-save-profile"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Hampiditra sy Hitahiry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
