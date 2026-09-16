import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  LayoutDashboard, 
  FileText, 
  Info, 
  User,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  student: StudentProfile;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenProfile: () => void;
  onOpenCurriculumInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  currentView,
  onNavigate,
  onOpenProfile,
  onOpenCurriculumInfo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top flag bar representing Madagascar colors: White, Red, Green */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-white border-b border-stone-200"></div>
        <div className="w-1/3 bg-red-600"></div>
        <div className="w-1/3 bg-emerald-600"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div 
            id="nav-brand"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 tracking-tight text-lg">
                  Fanabeazana<span className="text-emerald-600">IA</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-red-50 text-red-700 border border-red-200">
                  Madagascar
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Programme Scolaire Officiel • MEN
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-link-home"
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-stone-100 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Accueil
            </button>
            <button
              id="nav-link-classes"
              onClick={() => onNavigate('classes')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'classes' || currentView === 'subjects' || currentView === 'exercise'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Exercices & Niveaux
            </button>
            <button
              id="nav-link-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-stone-100 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              Tableau de Bord
            </button>
            <button
              id="nav-link-bulletin"
              onClick={() => onNavigate('bulletin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'bulletin'
                  ? 'bg-stone-100 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              Bulletin Numérique
            </button>
          </nav>

          {/* Right actions: Info & Profile */}
          <div className="flex items-center gap-2">
            <button
              id="btn-official-info"
              onClick={onOpenCurriculumInfo}
              title="Sources & Programmes Officiels MEN"
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Student badge */}
            <button
              id="btn-profile-badge"
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                {student.fullName ? student.fullName[0].toUpperCase() : 'M'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-stone-900 leading-tight truncate max-w-[120px]">
                  {student.fullName}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold leading-tight">
                  {student.classId} {student.serieId ? `• ${student.serieId}` : ''}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
