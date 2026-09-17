import React from 'react';
import { 
  X, 
  User, 
  Phone, 
  Briefcase, 
  Globe, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Code2, 
  Smartphone, 
  ShieldCheck, 
  MessageSquare,
  Flame,
  Award
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col text-stone-800 my-auto">
        
        {/* Header with Malagasy Emerald Gradient */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6 relative">
          <button
            id="btn-close-about-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Hidio"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md p-2 flex items-center justify-center shrink-0 border border-white/20 shadow-md">
              <img 
                src="/icon.svg" 
                alt="Educ-Mada Emblem" 
                className="w-full h-full object-contain filter drop-shadow"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-extrabold tracking-wider border border-amber-400/30 uppercase">
                Mombamomba ny Tetikasa
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                À Propos de Educ-Mada
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
                Fanabeazana Malagasy nomerika mampiasa Intelligence Artificielle
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          
          {/* SECTION 1: TANJON'ITY TETIKASA ITY (Mission & Objectifs) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-sm uppercase tracking-wide">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <h4>Tanjona amin'ity Tetikasa ity</h4>
            </div>

            <p className="text-stone-600">
              Ny <strong>Educ-Mada</strong> dia sehatra nomerika natsangana manokana mba hanampiana sy hanohanana ny mpianatra Malagasy rehetra manerana ny Nosy amin'ny alalan'ny teknolojia maoderina sy ny <strong>Intelligence Artificielle</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-stone-900 text-xs">Fandaharam-pianarana MEN</h5>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Mifanaraka 100% amin'ny fenitra ofisialin'ny Ministeran'ny Fanabeazam-pirenena (CEPE, BEPC, Baccalauréat L, S, OSE).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-stone-900 text-xs">Miasa Hors-ligne (PWA)</h5>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Azo apetraka amin'ny finday na solosaina ary miasa na tsy misy connexion Internet aza.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-stone-900 text-xs">Fampianarana & Fanazaran-tena</h5>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Niveau 1 hatramin'ny 10 miandalana, lesona feno azo alaina PDF, ary fanitsiana amin'ny teny Malagasy sy Frantsay.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-stone-900 text-xs">Bulletin & Tombana Ofisialy</h5>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Kajy naoty mifanaraka amin'ny coef ofisialy sy bulletin nomerika automatique.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: MPAMORONA NY TETIKASA (Créateur & Développeur) */}
          <section className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-black text-sm uppercase tracking-wide">
              <div className="w-6 h-6 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <h4>Mpamorona ny Tetikasa (Créateur & Développeur)</h4>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <div>
                <div className="text-base font-black text-stone-950 flex items-center gap-2">
                  <span>Ravelomanantsoa Urmin</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Développeur Concepteur
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Mpamorona sy Mpanorina ny sehatra Educ-Mada
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-stone-800">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Contact direct :</span>
                  <a 
                    href="tel:0323911654" 
                    className="text-emerald-700 hover:text-emerald-800 underline font-black text-sm"
                  >
                    032 39 116 54
                  </a>
                </div>
              </div>

              {/* Action buttons for contact */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <a
                  id="btn-call-creator"
                  href="tel:0323911654"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hiantso (Appeler)</span>
                </a>
                <a
                  id="btn-whatsapp-creator"
                  href="https://wa.me/261323911654?text=Salama%20tompoko%2C%20momba%20ny%20tetikasa%20Educ-Mada%20na%20famolavolana%20Site%20Web%20ho%20an'ny%20orinasa..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 3: TOLOTRA HO AN'NY ENTREPRISE LEHIBE (Services Professionnels) */}
          <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white space-y-3.5 shadow-lg border border-stone-800 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute right-0 top-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wide">
                <Building2 className="w-4 h-4 text-amber-400" />
                <h4>Tolotra ho an'ny ENTREPRISE lehibe</h4>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 uppercase tracking-wider">
                Services Pro
              </span>
            </div>

            <p className="text-xs text-stone-200 leading-relaxed">
              Mpanolotra vahaolana ara-teknolojia sy nomerika avo lenta izahay. <strong>Manolotra famolavolana sy fanamboarana Site Web sy Application matihanina ho an'ny ENTREPRISE lehibe</strong>, orinasa madinika sy salantsalany (PME), fikambanana, sekoly, ary institutions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <Code2 className="w-4 h-4 text-amber-400 mb-1" />
                <div className="font-bold text-white text-[11px]">Site Web Sur Mesure</div>
                <div className="text-[10px] text-stone-300 mt-0.5">Tranokala maoderina, haingana, mifanaraka amin'ny finday rehetra sy SEO.</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <Smartphone className="w-4 h-4 text-amber-400 mb-1" />
                <div className="font-bold text-white text-[11px]">Web Apps & PWA</div>
                <div className="text-[10px] text-stone-300 mt-0.5">Rindranasa fitantanana, Dashboard, E-commerce, ary Cloud Apps.</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <ShieldCheck className="w-4 h-4 text-amber-400 mb-1" />
                <div className="font-bold text-white text-[11px]">Fiarovana & Kalitao</div>
                <div className="text-[10px] text-stone-300 mt-0.5">Fiarovana avo lenta, hébergement miorina tsara, ary fanohanana maharitra.</div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10">
              <div className="text-xs text-stone-300 font-medium">
                Mila devis na manana tetikasa ho an'ny orinasanao ?
              </div>
              <a
                id="btn-entreprise-contact"
                href="tel:0323911654"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Mifandraisa aminay : 032 39 116 54</span>
              </a>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div>
            Educ-Mada • Fanabeazana & Fampandrosoana Nomerika
          </div>
          <button
            id="btn-close-about-bottom"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Hidio (Fermer)
          </button>
        </div>

      </div>
    </div>
  );
};
