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
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GradeLevel, TerminaleSerie } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'profile';
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
    loginWithGoogle, 
    logout, 
    updateStudentProfile,
    syncStatus 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'profile'>(
    currentUser ? 'profile' : initialMode
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithEmail(email.trim(), password);
      setSuccessMsg('Tafiditra soa aman-tsara ianao ! (Connexion réussie)');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
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
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
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

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle(classId, serieId);
      setSuccessMsg('Tafiditra tamin\'ny alalan\'ny Google soa aman-tsara !');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Nisy olana tamin\'ny fidirana Google. Andramo indray azafady.');
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tahiry An-tserasera (Base de Données Firestore)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Espace Mpianatra & Mpanabe
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Tahirizo anaty base de données ny naotinao, ny niveau vitanao ary ny Bulletin Scolaire ofisialy.
          </p>
        </div>

        {/* Tab Switcher (Connexion / Inscription / Mon Profil) */}
        <div className="flex rounded-xl bg-stone-100 p-1 mb-6">
          {currentUser ? (
            <button
              onClick={() => { setMode('profile'); resetForm(); }}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 bg-white text-emerald-800 shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Kaontiko (Mon Compte)</span>
            </button>
          ) : (
            <>
              <button
                id="tab-auth-login"
                onClick={() => { setMode('login'); resetForm(); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Hiditra (Connexion)</span>
              </button>
              <button
                id="tab-auth-register"
                onClick={() => { setMode('register'); resetForm(); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Hisoratra Anarana (Inscription)</span>
              </button>
            </>
          )}
        </div>

        {/* Notifications / Errors */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && !currentUser && (
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
                    <span>Hiditra amin'ny Kaonty (Se Connecter)</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative my-5">
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

            {/* Switch to Register */}
            <div className="mt-4 text-center">
              <span className="text-xs text-stone-500">Mbola tsy manana kaonty ? </span>
              <button
                type="button"
                onClick={() => { setMode('register'); resetForm(); }}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Mamorona kaonty maimaimpoana
              </button>
            </div>
          </div>
        )}

        {/* 2. REGISTRATION FORM */}
        {mode === 'register' && !currentUser && (
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
                    <span>Hamorona ny Kaontiko (Créer mon compte)</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-xs text-stone-500">Efa manana kaonty ? </span>
              <button
                type="button"
                onClick={() => { setMode('login'); resetForm(); }}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Midira eto (Se connecter)
              </button>
            </div>
          </div>
        )}

        {/* 3. PROFILE MANAGEMENT (When logged in) */}
        {currentUser && (
          <div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    student.fullName ? student.fullName[0].toUpperCase() : 'M'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-extrabold text-stone-900">
                      {student.fullName}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                      Connecté
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-md border border-emerald-300 flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-emerald-600" />
                  Cloud Synced
                </span>
              </div>
            </div>

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
        {!currentUser && (
          <div className="mt-5 pt-4 border-t border-stone-100 text-center">
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
