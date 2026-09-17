import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, CheckCircle2, X, Sparkles, Monitor, Info } from 'lucide-react';

interface PWAInstallProps {
  variant?: 'hero' | 'header' | 'floating' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallProps> = ({ variant = 'hero', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showManualModal, setShowManualModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else {
      // Show guided instructions for iOS Safari or browsers without beforeinstallprompt
      setShowManualModal(true);
    }
  };

  // If already running as standalone app
  if (isInstalled) {
    if (variant === 'header') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>App Installée</span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {/* Variant: HERO (Big highlighted card/button on home page) */}
      {variant === 'hero' && (
        <div className={`w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white shadow-lg relative overflow-hidden border border-emerald-600/40 ${className}`}>
          {/* Background decorative glow */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md p-1.5 flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                <img 
                  src="/icon.svg" 
                  alt="Educ-Mada Logo" 
                  className="w-full h-full object-contain drop-shadow"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/30">
                    PWA Ofisialy
                  </span>
                  <span className="text-xs text-emerald-200 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Miasa hors-ligne 100%
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                  Installer cette application
                </h3>
                <p className="text-xs text-emerald-100/90 leading-snug">
                  Apetraho mivantana amin'ny findainao na solosainao mba hianarana haingana tsy mila manokatra navigateur.
                </p>
              </div>
            </div>

            <button
              id="btn-install-pwa-hero"
              onClick={handleInstallClick}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-950 stroke-[2.5]" />
              <span>Installer cette application</span>
            </button>
          </div>
        </div>
      )}

      {/* Variant: HEADER (Compact button for top navigation) */}
      {variant === 'header' && (
        <button
          id="btn-install-pwa-header"
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer ${className}`}
          title="Installer l'application sur votre appareil"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden md:inline">Installer l'application</span>
          <span className="md:hidden">Installer</span>
        </button>
      )}

      {/* Variant: FLOATING BADGE (Fixed bottom button on mobile) */}
      {variant === 'floating' && (
        <button
          id="btn-install-pwa-floating"
          onClick={handleInstallClick}
          className={`fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900/95 text-white font-bold text-xs shadow-2xl border border-stone-700 backdrop-blur-md hover:bg-stone-800 transition-all cursor-pointer ${className}`}
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Download className="w-3 h-3 stroke-[3]" />
          </div>
          <span>Installer l'application</span>
        </button>
      )}

      {/* Success Notification */}
      {installSuccess && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <div className="text-xs font-bold">
            Tafapetraka soa aman-tsara ny Educ-Mada !
          </div>
        </div>
      )}

      {/* GUIDED INSTALLATION MODAL (For iOS Safari or manual installation) */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-stone-200 text-stone-800 relative">
            <button
              onClick={() => setShowManualModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                <img 
                  src="/icon.svg" 
                  alt="Educ-Mada Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 tracking-tight">
                  Ahoana ny fametrahana ny Educ-Mada ?
                </h4>
                <p className="text-xs text-stone-500">
                  Torolalana fametrahana mivantana (Installation PWA)
                </p>
              </div>
            </div>

            {/* Content per platform */}
            {isIOS ? (
              <div className="space-y-3 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>Amin'ny iPhone / iPad (Safari) :</span>
                </div>
                <ol className="space-y-2 text-stone-700 list-decimal list-inside pl-1">
                  <li>
                    Tsindrio ny bokotra <strong>« Partager / Share »</strong> <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> eo ambany amin'ny Safari.
                  </li>
                  <li>
                    Fidio ny <strong>« Sur l'écran d'accueil »</strong> (Add to Home Screen) <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-700" />.
                  </li>
                  <li>
                    Tsindrio ny <strong>« Ajouter »</strong> eo an-tampony havanana.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-emerald-600" />
                  <span>Amin'ny Android na Solosaina (Chrome, Edge, Brave) :</span>
                </div>
                <ol className="space-y-2 text-stone-700 list-decimal list-inside pl-1">
                  <li>
                    Tsindrio ny teboka telo <strong>(⋮)</strong> eo an-tampony havanana amin'ny navigateur.
                  </li>
                  <li>
                    Safidio ny <strong>« Installer l'application »</strong> na <strong>« Ajouter à l'écran d'accueil »</strong>.
                  </li>
                  <li>
                    Manamafy amin'ny fanindriana <strong>« Installer »</strong>.
                  </li>
                </ol>
              </div>
            )}

            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2 text-xs text-emerald-900">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Rehefa tafapetraka ny rindranasa dia afaka mianatra sy manao fanazaran-tena amin'ny fotoana rehetra ianao, na tsy misy connexion Internet aza !
              </span>
            </div>

            <button
              onClick={() => setShowManualModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Mazava tompoko (Fermer)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
