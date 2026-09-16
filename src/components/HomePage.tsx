import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  FileCheck2,
  TrendingUp
} from 'lucide-react';
import { GradeLevel, TerminaleSerie } from '../types';

interface HomePageProps {
  onStart: () => void;
  onLogin: () => void;
  onSelectClass: (grade: GradeLevel, serie?: TerminaleSerie) => void;
  onOpenCurriculumInfo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStart,
  onLogin,
  onSelectClass,
  onOpenCurriculumInfo,
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Decorative background blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-red-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fandaharam-pianarana Malagasy Vaovao • MEN Madagascar</span>
          </div>

          {/* Exact Requested Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Plateforme intelligente d'exercices scolaires à Madagascar
          </h1>

          {/* Exact Requested Description */}
          <p className="text-base sm:text-lg text-stone-700 font-normal leading-relaxed max-w-2xl mx-auto">
            « Mianara, manaova exercices ary mandrosoa niveau amin'ny alalan'ny exercices générés par intelligence artificielle, mifanaraka amin'ny programme scolaire ankehitriny. »
          </p>

          {/* Requested Buttons: COMMENCER & SE CONNECTER */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              id="btn-commencer-hero"
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>COMMENCER</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="btn-se-connecter-hero"
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-base border border-stone-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>SE CONNECTER</span>
            </button>
          </div>
        </div>

        {/* 3 Main Target Classes Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CM2 Card */}
          <div 
            id="card-class-cm2"
            onClick={() => onSelectClass('CM2')}
            className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Ambaratonga Voalohany
                </span>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                  CEPE
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Classe de CM2
              </h3>
              <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                Fanomanana ny fanadinana ofisialy CEPE. Mathématiques (Kajy), Malagasy, Français, Tontolo iainana & Siansa, Tantara sy Jeografia.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-emerald-700 text-sm font-semibold">
              <span>Hifidy ny CM2</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3ème Card */}
          <div 
            id="card-class-3eme"
            onClick={() => onSelectClass('3ème')}
            className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                  Ambaratonga Faharoa 1
                </span>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                  BEPC
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Classe de 3ème
              </h3>
              <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                Fanomanana ny fanadinana BEPC. Mathématiques, Physique-Chimie, SVT, Malagasy, Français, Histoire-Géo sy Fanabeazana olom-pirenena, Anglais.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-emerald-700 text-sm font-semibold">
              <span>Hifidy ny 3ème</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Terminale Card with 3 Series */}
          <div 
            id="card-class-terminale"
            onClick={() => onSelectClass('Terminale', 'Série S')}
            className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-md">
                  Lycée • Baccalauréat
                </span>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                  BACC
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Classe de Terminale
              </h3>
              <p className="text-sm text-stone-600 mb-3 leading-relaxed">
                Fandaharam-pianarana vaovao réformé :
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                  Série L (Littéraire)
                </span>
                <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200">
                  Série S (Scientifique)
                </span>
                <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
                  Série OSE (Économie)
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-emerald-700 text-sm font-semibold">
              <span>Hifidy ny Terminale</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Pedagogical Integrity */}
        <div className="mt-16 bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
              Fitsipika fototra sy fenitra pédagogique
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Rafitra miorina amin'ny fepetra ofisialy avy amin'ny Ministère de l'Éducation Nationale
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Niveau 1 hatramin'ny 10</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Mora sy fototra (N1) ka hatramin'ny tena sarotra sy avo lenta (N10) mitaky fandalinana sy raisonnement.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Timer 10 Minutes</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Countdown 10:00 isaky ny fanontaniana. Raha tapitra ny fotoana dia voamarika ho tsy voavaly.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Règle de Passage ≥ 12/20</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Moyenne ≥ 12/20 = VALIDÉ (miakatra niveau). Moyenne &lt; 12/20 = REDOUBLE (averina ny niveau).
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Bulletin Numérique</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Bulletin ofisialy manambara ny naoty isaky ny matière, ny salan'isa ankapobeny ary azo alaina PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer banner */}
      <footer className="border-t border-stone-200 bg-white py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            FanabeazanaIA Madagascar • Mifototra amin'ny programa ofisialin'ny MEN
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenCurriculumInfo}
              className="text-emerald-700 hover:underline font-medium cursor-pointer"
            >
              Loharano sy Fandaharam-pianarana Ofisialy
            </button>
            <span>•</span>
            <span>CEPE • BEPC • BACC (L, S, OSE)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
