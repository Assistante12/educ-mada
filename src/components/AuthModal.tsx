import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  School, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Cloud, 
  LogOut, 
  ShieldCheck, 
  Loader2,
  KeyRound,
  UserPlus,
  LogIn,
  ExternalLink,
  HelpCircle,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GradeLevel, TerminaleSerie } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'profile' | 'local';
}

interface DiagnosticGuide {
  title: string;
  problem: string;
  solutionTitle: string;
  steps: string[];
  consoleUrl?: string;
  consoleButtonText?: string;
  canUseLocal: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { 
    currentUser, 
    student, 
    loginWithEmail, 
    registerWithEmail, 
    registerLocalAccount,
    loginWithGoogle, 
    logout, 
    updateStudentProfile,
    syncStatus 
  } = useAuth();

  const isLocalUser = !currentUser && student?.authProvider === 'local';

  const [mode, setMode] = useState<'login' | 'register' | 'profile' | 'local'>(
    currentUser || isLocalUser ? 'profile' : initialMode
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState(student?.fullName || '');
  const [schoolName, setSchoolName] = useState(student?.schoolName || '');
  const [classId, setClassId] = useState<GradeLevel>(student?.classId || 'Terminale');
  const [serieId, setSerieId] = useState<TerminaleSerie>(student?.serieId || 'Série S');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosticGuide, setDiagnosticGuide] = useState<DiagnosticGuide | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'educ-mada.vercel.app';

  const resetForm = () => {
    setError(null);
    setDiagnosticGuide(null);
    setSuccessMsg(null);
  };

  const handleBypassToLocal = () => {
    try {
      registerLocalAccount({
        fullName: fullName.trim() || student?.fullName || 'Mpianatra Malagasy',
        schoolName: schoolName.trim() || student?.schoolName || 'Lycée / Collège / EPP Madagascar',
        classId,
        serieId: classId === 'Terminale' ? serieId : undefined,
        email: email.trim() || undefined
      });
      setSuccessMsg('Tafiditra soa aman-tsara amin\'ny Mode Local ianao ! Voatahiry eto amin\'ny fitaovanao ny ezaka rehetra.');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (e: any) {
      setError('Nisy olana teo am-pamoronana ny kaonty an-toerana.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDiagnosticGuide(null);
    setLoading(true);

    try {
      await loginWithEmail(email.trim(), password);
      setSuccessMsg('Tafiditra soa aman-tsara ianao ! (Connexion réussie)');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Mbola tsy mavitrika ao amin\'ny Firebase ny fidirana amin\'ny Email/Password.');
        setDiagnosticGuide({
          title: 'Email/Password mbola tsy navadika ho mavitrika ao amin\'i Firebase',
          problem: 'Mbola tsy natsangana ho "Enabled" ny fidirana Email/Password ao amin\'ny Firebase Authentication console ho an\'ity tetikasa ity.',
          solutionTitle: 'Fomba famahana azy ao amin\'ny Firebase Console (30 segondra) :',
          steps: [
            'Sokafy ny Firebase Console > Authentication > Sign-in method.',
            'Kitiho ny "Email/Password".',
            'Velomy ho "Enable" ny safidy voalohany ary tsindrio ny "Save".'
          ],
          consoleUrl: 'https://console.firebase.google.com/project/effortless-rainfall-gf38q/authentication/providers',
          consoleButtonText: 'Sokafy ny Firebase Sign-in method',
          canUseLocal: true
        });
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Diso ny mailaka na ny tenimiafina nampidirinao. (Email ou mot de passe incorrect)');
      } else if (err.code === 'auth/invalid-email') {
        setError('Tsy manara-penitra ny adiresy mailaka. (Format d\'email invalide)');
      } else {
        setError(err.message || 'Nisy olana teo am-pidirana. Andramo indray azafady.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDiagnosticGuide(null);

    if (password.length < 6) {
      setError('Mila manana litera na tarehimarika 6 farafahakeliny ny tenimiafina. (6 caractères minimum)');
      return;
    }

    if (password !== confirmPassword) {
      setError('Tsy mitovy ny tenimiafina roa nampidirinao. (Les mots de passe ne correspondent pas)');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password, {
        fullName: fullName.trim() || 'Mpianatra Malagasy',
        schoolName: schoolName.trim() || 'Lycée / Collège / EPP Madagascar',
        classId,
        serieId: classId === 'Terminale' ? serieId : undefined
      });
      setSuccessMsg('Voaforona soa aman-tsara ny kaontinao ary voatahiry anaty Database ! (Compte créé avec succès)');
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Mbola tsy mavitrika ao amin\'ny Firebase ny fidirana amin\'ny Email/Password.');
        setDiagnosticGuide({
          title: 'Email/Password mbola tsy mavitrika ao amin\'i Firebase (auth/operation-not-allowed)',
          problem: 'Mbola tsy natsangana ho "Enabled" ny fidirana Email/Password ao amin\'ny Firebase Console ho an\'ity tetikasa ity.',
          solutionTitle: 'Fomba famahana azy ao amin\'ny Firebase Console (30 segondra) :',
          steps: [
            'Sokafy ny Firebase Console > Authentication > Sign-in method.',
            'Kitiho ny mpanome tolotra "Email/Password".',
            'Velomy (Activer) ny safidy voalohany (Email/Password) ary tsindrio ny "Save".'
          ],
          consoleUrl: 'https://console.firebase.google.com/project/effortless-rainfall-gf38q/authentication/providers',
          consoleButtonText: 'Sokafy ny Firebase Sign-in method',
          canUseLocal: true
        });
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Efa misy mampiasa ity adiresy mailaka ity. Mampiasà mailaka hafa na midira mivantana.');
      } else if (err.code === 'auth/weak-password') {
        setError('Malemy loatra ny tenimiafina. Mampiasà tarehimarika sy litera maro kokoa.');
      } else {
        setError(err.message || 'Tsy nahomby ny fisoratana anarana. Andramo indray azafady.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocalRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDiagnosticGuide(null);
    setLoading(true);

    try {
      registerLocalAccount({
        fullName: fullName.trim() || 'Mpianatra Malagasy',
        schoolName: schoolName.trim() || 'Lycée / Collège / EPP Madagascar',
        classId,
        serieId: classId === 'Terminale' ? serieId : undefined,
        email: email.trim() || undefined
      });
      setSuccessMsg('Voaforona soa aman-tsara ny kaontinao eto an-toerana (Mode Local) !');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (e: any) {
      setError('Tsy nahomby ny famoronana ny kaonty local.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setDiagnosticGuide(null);
    setLoading(true);
    try {
      await loginWithGoogle(classId, serieId);
      setSuccessMsg('Tafiditra tamin\'ny alalan\'ny Google soa aman-tsara !');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError(`Domaine « ${currentDomain} » tsy mbola nankatoavina tao amin'ny Firebase (Authorized Domains)`);
        setDiagnosticGuide({
          title: 'Domaine Vercel tsy mbola nankatoavina (auth/unauthorized-domain)',
          problem: `Ny navigateur dia mandà ny fidirana amin'ny Google satria ny domaine "${currentDomain}" dia mbola tsy tafiditra ao amin'ny lisitry ny Authorized Domains ao amin'ny Firebase Console.`,
          solutionTitle: 'Fomba famahana azy ao amin\'ny Firebase Console (1 minitra) :',
          steps: [
            'Sokafy ny Firebase Console ao amin\'ny Authentication > Settings > Authorized domains.',
            `Tsindrio ny "Add domain" ary ampidiro: ${currentDomain}`,
            'Tsindrio ny "Save". Miasa avy hatrany ny fidirana amin\'ny Google aorian\'izay !'
          ],
          consoleUrl: 'https://console.firebase.google.com/project/effortless-rainfall-gf38q/authentication/settings',
          consoleButtonText: 'Sokafy ny Firebase Settings (Authorized Domains)',
          canUseLocal: true
        });
      } else if (err.code === 'auth/popup-blocked') {
        setError('Nosakanan\'ny navigateur ny popup Google. Avelao handeha ny popup na ampiasao ny Mode Local.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Nisy olana tamin\'ny fidirana Google. Andramo indray azafady.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updateStudentProfile(
        fullName.trim() || 'Mpianatra Malagasy',
        schoolName.trim() || 'Lycée / Collège / EPP Madagascar',
        classId,
        classId === 'Terminale' ? serieId : undefined
      );
      setSuccessMsg('Voaova soa aman-tsara ny mombamomba anao ! (Profil mis à jour)');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError('Tsy nahomby ny fanovana. Andramo indray.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setMode('login');
      setSuccessMsg('Tafavoaka soa aman-tsara ianao.');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError('Tsy nahomby ny fialana.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative my-8">
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tahiry An-tserasera (Firebase & Firestore)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Espace Mpianatra & Mpanabe
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Tahirizo anaty base de données ny naotinao, ny niveau vitanao ary ny Bulletin Scolaire ofisialy.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-stone-100 p-1 mb-5">
          {currentUser || isLocalUser ? (
            <button
              onClick={() => { setMode('profile'); resetForm(); }}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 bg-white text-emerald-800 shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Kaontiko ({currentUser ? 'Connecté Firebase' : 'Mode Local'})</span>
            </button>
          ) : (
            <>
              <button
                id="tab-auth-login"
                onClick={() => { setMode('login'); resetForm(); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Hiditra</span>
              </button>
              <button
                id="tab-auth-register"
                onClick={() => { setMode('register'); resetForm(); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Hisoratra</span>
              </button>
              <button
                id="tab-auth-local"
                onClick={() => { setMode('local'); resetForm(); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  mode === 'local'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Mode Local</span>
              </button>
            </>
          )}
        </div>

        {/* Notifications / Errors */}
        {error && !diagnosticGuide && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* DIAGNOSTIC BANNER WITH DIRECT ACTION */}
        {diagnosticGuide && (
          <div className="p-4 mb-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-3 animate-in fade-in shadow-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                  {diagnosticGuide.title}
                </h4>
                <p className="text-amber-800 mt-1 leading-relaxed">
                  {diagnosticGuide.problem}
                </p>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
              <span className="font-bold text-stone-900 block mb-1.5">
                {diagnosticGuide.solutionTitle}
              </span>
              <ol className="list-decimal list-inside space-y-1 text-stone-700">
                {diagnosticGuide.steps.map((st, i) => (
                  <li key={i} className="leading-snug">{st}</li>
                ))}
              </ol>

              {diagnosticGuide.consoleUrl && (
                <div className="mt-3">
                  <a
                    href={diagnosticGuide.consoleUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <span>{diagnosticGuide.consoleButtonText || 'Sokafy ny Firebase Console'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {diagnosticGuide.canUseLocal && (
              <div className="pt-1 flex items-center justify-between gap-2 border-t border-amber-200">
                <span className="text-[11px] text-amber-800 font-medium">
                  Tsy te hiandry ? Afaka manohy avy hatrany ianao :
                </span>
                <button
                  type="button"
                  id="btn-bypass-local-mode"
                  onClick={handleBypassToLocal}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Tohizo amin'ny Mode Local
                </button>
              </div>
            )}
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && !currentUser && !isLocalUser && (
          <div>
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Adiresy Mailaka (Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="email"
                    id="input-login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mpianatra@gmail.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Tenimiafina (Mot de passe)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="password"
                    id="input-login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Hiditra amin'ny Kaonty</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-stone-400 font-bold">na amin'ny alalan'ny</span>
              </div>
            </div>

            {/* Google Fast Login */}
            <button
              type="button"
              id="btn-google-login"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Hiditra amin'ny Google</span>
            </button>

            {/* Quick Switch to Local Mode */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => { setMode('register'); resetForm(); }}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Hisoratra Anarana
              </button>
              <button
                type="button"
                onClick={() => { setMode('local'); resetForm(); }}
                className="text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <HardDrive className="w-3 h-3 text-stone-500" />
                <span>Mampiasà Mode Local</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. REGISTRATION FORM (Firebase Cloud) */}
        {mode === 'register' && !currentUser && !isLocalUser && (
          <div>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Anarana Feno (Nom & Prénom)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    id="input-register-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ohatra : RABE Andry"
                    required
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Sekoly / Toeram-pianarana
                </label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    id="input-register-school"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Ohatra : Lycée JJ Rabearivelo"
                    required
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kilasy
                  </label>
                  <select
                    id="select-register-class"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="CM2">CM2 (CEPE)</option>
                    <option value="3ème">3ème (BEPC)</option>
                    <option value="Terminale">Terminale (Bac)</option>
                  </select>
                </div>

                {classId === 'Terminale' && (
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Série
                    </label>
                    <select
                      id="select-register-serie"
                      value={serieId}
                      onChange={(e) => setSerieId(e.target.value as TerminaleSerie)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                    >
                      <option value="Série L">Série L</option>
                      <option value="Série S">Série S</option>
                      <option value="Série OSE">Série OSE</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Adiresy Mailaka (Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="email"
                    id="input-register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mpianatra@gmail.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Tenimiafina
                  </label>
                  <input
                    type="password"
                    id="input-register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Farafahakeliny 6"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Fanamafisana
                  </label>
                  <input
                    type="password"
                    id="input-register-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Avereno eto"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-register"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Hamorona ny Kaontiko (Firebase Cloud)</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => { setMode('login'); resetForm(); }}
                className="text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
              >
                Midira raha efa manana kaonty
              </button>
              <button
                type="button"
                onClick={() => { setMode('local'); resetForm(); }}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HardDrive className="w-3 h-3" />
                <span>Mode Local (Tsy mila mot de passe)</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. LOCAL ACCOUNT REGISTRATION (100% Offline & Reliable on Vercel) */}
        {mode === 'local' && !currentUser && !isLocalUser && (
          <div>
            <div className="p-3 mb-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
              <HardDrive className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block">Kaonty eto an-toerana (Mode Local / Hors-ligne) :</span>
                Tsy mila tenimiafina ary miasa 100% na misy na tsy misy Internet. Voatahiry ao amin'ny navigateur anao ny naoty rehetra.
              </div>
            </div>

            <form onSubmit={handleLocalRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Anarana Feno (Nom & Prénom)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    id="input-local-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ohatra : RABE Andry"
                    required
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Sekoly / Toeram-pianarana
                </label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    id="input-local-school"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Ohatra : Lycée JJ Rabearivelo"
                    required
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kilasy
                  </label>
                  <select
                    id="select-local-class"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="CM2">CM2 (CEPE)</option>
                    <option value="3ème">3ème (BEPC)</option>
                    <option value="Terminale">Terminale (Bac)</option>
                  </select>
                </div>

                {classId === 'Terminale' && (
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Série
                    </label>
                    <select
                      id="select-local-serie"
                      value={serieId}
                      onChange={(e) => setSerieId(e.target.value as TerminaleSerie)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                    >
                      <option value="Série L">Série L</option>
                      <option value="Série S">Série S</option>
                      <option value="Série OSE">Série OSE</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Adiresy Mailaka (Safidy - Optionnel)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="email"
                    id="input-local-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mpianatra@gmail.com (tsy voatery)"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-local"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hiditra amin'ny Mode Local (Maimaimpoana)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* 4. PROFILE MANAGEMENT (When logged in via Firebase or Local) */}
        {(currentUser || isLocalUser) && (
          <div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    student?.fullName ? student.fullName[0].toUpperCase() : 'M'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-extrabold text-stone-900">
                      {student?.fullName || 'Mpianatra Malagasy'}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                      {currentUser ? 'Connecté Firebase' : 'Mode Local'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {currentUser?.email || student?.email || 'Mpianatra an-toerana'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 ${
                  currentUser 
                    ? 'text-emerald-800 bg-white border-emerald-300' 
                    : 'text-teal-800 bg-teal-50 border-teal-200'
                }`}>
                  {currentUser ? (
                    <>
                      <Cloud className="w-3 h-3 text-emerald-600" />
                      <span>Cloud Synced</span>
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-3 h-3 text-teal-600" />
                      <span>Stockage Local</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* If local user, offer quick upgrade to Google or Email */}
            {!currentUser && isLocalUser && (
              <div className="p-3 mb-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-900">
                <div>
                  <span className="font-bold block">Te hitahiry an-tserasera (Cloud) ?</span>
                  Afaka mampifandray amin'ny Google na Firebase ianao mba tsy ho very ny naotinao.
                </div>
                <button
                  type="button"
                  id="btn-sync-to-google"
                  onClick={handleGoogleAuth}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                >
                  Mampifandray Google
                </button>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Anarana Feno (Nom & Prénom)
                </label>
                <input
                  type="text"
                  id="input-profile-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Sekoly / Toeram-pianarana
                </label>
                <input
                  type="text"
                  id="input-profile-school"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kilasy
                  </label>
                  <select
                    id="select-profile-class"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="CM2">CM2 (CEPE)</option>
                    <option value="3ème">3ème (BEPC)</option>
                    <option value="Terminale">Terminale (Bac)</option>
                  </select>
                </div>

                {classId === 'Terminale' && (
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Série
                    </label>
                    <select
                      id="select-profile-serie"
                      value={serieId}
                      onChange={(e) => setSerieId(e.target.value as TerminaleSerie)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                    >
                      <option value="Série L">Série L</option>
                      <option value="Série S">Série S</option>
                      <option value="Série OSE">Série OSE</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  id="btn-update-profile"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hitahiry ny Fanovana</span>
                </button>

                <button
                  type="button"
                  id="btn-logout"
                  onClick={handleLogout}
                  disabled={loading}
                  className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 border border-stone-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Hiala (Déconnexion)</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Guest continuation option */}
        {!currentUser && !isLocalUser && (
          <div className="mt-5 pt-4 border-t border-stone-100 text-center flex items-center justify-center gap-4">
            <button
              id="btn-continue-as-guest"
              onClick={onClose}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium underline cursor-pointer"
            >
              Hanohy amin'ny maha Mpitsidika (Mode Invité)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
