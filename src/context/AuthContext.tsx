import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  auth, 
  googleProvider, 
  FirebaseUser 
} from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  syncUserProfileToFirestore, 
  fetchUserProfileFromFirestore, 
  fetchUserProgressFromFirestore,
  saveProgressToFirestore,
  uploadLocalProgressToFirestore
} from '../lib/firestoreService';
import { 
  getStoredStudent, 
  saveStudent, 
  recordSessionResult as recordSessionLocally,
  updateStudentProfileInfo as updateProfileLocally 
} from '../utils/storage';
import { StudentProfile, GradeLevel, TerminaleSerie, LevelSessionResult } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  student: StudentProfile;
  isLoading: boolean;
  isSyncing: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline' | 'guest';
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    email: string, 
    pass: string, 
    profileData: {
      fullName: string;
      schoolName: string;
      classId: GradeLevel;
      serieId?: TerminaleSerie;
    }
  ) => Promise<void>;
  registerLocalAccount: (profileData: {
    fullName: string;
    schoolName: string;
    classId: GradeLevel;
    serieId?: TerminaleSerie;
    email?: string;
  }) => StudentProfile;
  loginWithGoogle: (preferredClass?: GradeLevel, preferredSerie?: TerminaleSerie) => Promise<void>;
  logout: () => Promise<void>;
  updateStudentProfile: (
    fullName: string, 
    schoolName: string, 
    classId: GradeLevel, 
    serieId?: TerminaleSerie
  ) => Promise<void>;
  recordResult: (result: LevelSessionResult) => Promise<StudentProfile>;
  refreshCloudData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [student, setStudent] = useState<StudentProfile>(() => getStoredStudent());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'guest'>('guest');

  // Helper to merge remote progress with local progress
  const mergeProgress = (
    local: StudentProfile,
    remoteProgress: Record<string, any>
  ): StudentProfile => {
    const mergedProgress = { ...(local.progress || {}) };

    for (const [key, remoteItem] of Object.entries(remoteProgress)) {
      const localItem = mergedProgress[key];
      if (!localItem) {
        mergedProgress[key] = remoteItem;
      } else {
        // Keep the best maxUnlockedLevel and merge levelScores
        const bestUnlocked = Math.max(localItem.maxUnlockedLevel || 1, remoteItem.maxUnlockedLevel || 1);
        const mergedLevelScores = { ...(localItem.levelScores || {}), ...(remoteItem.levelScores || {}) };
        
        // Sum total score
        let totalScore = 0;
        for (let l = 1; l <= 10; l++) {
          totalScore += mergedLevelScores[l] || 0;
        }
        totalScore = Math.round(totalScore * 10) / 10;

        mergedProgress[key] = {
          ...localItem,
          maxUnlockedLevel: bestUnlocked,
          levelScores: mergedLevelScores,
          subjectTotalScore: totalScore,
          averageScore: totalScore,
          totalExercisesDone: Math.max(localItem.totalExercisesDone || 0, remoteItem.totalExercisesDone || 0),
          totalCorrect: Math.max(localItem.totalCorrect || 0, remoteItem.totalCorrect || 0),
          progressionPercent: Math.min(100, Math.round((bestUnlocked / 10) * 100))
        };
      }
    }

    return {
      ...local,
      progress: mergedProgress
    };
  };

  // Sync user state from Firestore
  const syncUserData = useCallback(async (user: FirebaseUser) => {
    setIsSyncing(true);
    setSyncStatus('syncing');

    try {
      // 1. Fetch profile
      let remoteProfile = await fetchUserProfileFromFirestore(user.uid);
      if (!remoteProfile) {
        // First time or missing doc: sync current local profile to Firestore
        const currentLocal = getStoredStudent();
        remoteProfile = await syncUserProfileToFirestore(user, {
          fullName: currentLocal.fullName || user.displayName || 'Mpianatra Malagasy',
          schoolName: currentLocal.schoolName || 'Lycée / Collège Madagascar',
          classId: currentLocal.classId || 'Terminale',
          serieId: currentLocal.serieId || 'Série S'
        });
      }

      // 2. Fetch progress from subcollection
      const remoteProgress = await fetchUserProgressFromFirestore(user.uid);

      // 3. Merge with local
      const currentLocal = getStoredStudent();
      let updatedStudent: StudentProfile = {
        ...currentLocal,
        id: user.uid,
        uid: user.uid,
        email: user.email || currentLocal.email,
        fullName: remoteProfile.fullName || currentLocal.fullName || user.displayName || 'Mpianatra Malagasy',
        schoolName: remoteProfile.schoolName || currentLocal.schoolName || 'Lycée / Collège Madagascar',
        classId: remoteProfile.classId || currentLocal.classId || 'Terminale',
        serieId: remoteProfile.classId === 'Terminale' ? (remoteProfile.serieId || currentLocal.serieId || 'Série S') : undefined,
        photoURL: user.photoURL || undefined,
        isAnonymous: user.isAnonymous,
        authProvider: user.providerData[0]?.providerId || 'password',
        lastActive: new Date().toISOString()
      };

      updatedStudent = mergeProgress(updatedStudent, remoteProgress);

      // 4. Save to local storage and update React state
      saveStudent(updatedStudent);
      setStudent(updatedStudent);

      // 5. Also push any previously unpushed local progress to Firestore
      await uploadLocalProgressToFirestore(user.uid, updatedStudent);

      setSyncStatus('synced');
    } catch (err) {
      console.error('Error syncing user data from Firestore:', err);
      setSyncStatus('offline');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserData(user);
      } else {
        setSyncStatus('guest');
        // Load local guest student
        const local = getStoredStudent();
        setStudent(local);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [syncUserData]);

  // Auth methods
  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await syncUserData(cred.user);
    }
  };

  const registerWithEmail = async (
    email: string, 
    pass: string, 
    profileData: {
      fullName: string;
      schoolName: string;
      classId: GradeLevel;
      serieId?: TerminaleSerie;
    }
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      // Update Auth display name
      if (profileData.fullName) {
        await updateFirebaseProfile(cred.user, {
          displayName: profileData.fullName
        });
      }

      // Save to Firestore
      await syncUserProfileToFirestore(cred.user, profileData);

      // Update local student
      const updated: StudentProfile = {
        ...getStoredStudent(),
        id: cred.user.uid,
        uid: cred.user.uid,
        email: cred.user.email || email,
        fullName: profileData.fullName,
        schoolName: profileData.schoolName,
        classId: profileData.classId,
        serieId: profileData.classId === 'Terminale' ? (profileData.serieId || 'Série S') : undefined,
        lastActive: new Date().toISOString()
      };
      saveStudent(updated);
      setStudent(updated);

      // Push initial progress to Firestore
      await uploadLocalProgressToFirestore(cred.user.uid, updated);
      await syncUserData(cred.user);
    }
  };

  const registerLocalAccount = (profileData: {
    fullName: string;
    schoolName: string;
    classId: GradeLevel;
    serieId?: TerminaleSerie;
    email?: string;
  }): StudentProfile => {
    const current = getStoredStudent();
    const updated: StudentProfile = {
      ...current,
      id: current.id && !current.id.startsWith('guest_') ? current.id : `local_${Date.now()}`,
      uid: current.uid && !current.uid.startsWith('guest_') ? current.uid : `local_${Date.now()}`,
      email: profileData.email || current.email || (profileData.fullName ? `${profileData.fullName.toLowerCase().replace(/\s+/g, '')}@local.mada` : 'mpianatra@local.mada'),
      fullName: profileData.fullName || current.fullName || 'Mpianatra Malagasy',
      schoolName: profileData.schoolName || current.schoolName || 'Lycée / Collège / EPP Madagascar',
      classId: profileData.classId || current.classId || 'Terminale',
      serieId: profileData.classId === 'Terminale' ? (profileData.serieId || current.serieId || 'Série S') : undefined,
      authProvider: 'local',
      lastActive: new Date().toISOString()
    };
    saveStudent(updated);
    setStudent(updated);
    setSyncStatus('offline');
    return updated;
  };

  const loginWithGoogle = async (preferredClass?: GradeLevel, preferredSerie?: TerminaleSerie) => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      const current = getStoredStudent();
      await syncUserProfileToFirestore(result.user, {
        fullName: result.user.displayName || current.fullName,
        schoolName: current.schoolName,
        classId: preferredClass || current.classId,
        serieId: preferredClass === 'Terminale' ? (preferredSerie || current.serieId || 'Série S') : undefined
      });
      await syncUserData(result.user);
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setSyncStatus('guest');
  };

  const updateStudentProfile = async (
    fullName: string, 
    schoolName: string, 
    classId: GradeLevel, 
    serieId?: TerminaleSerie
  ) => {
    const updatedLocal = updateProfileLocally(fullName, schoolName, classId, serieId);
    setStudent(updatedLocal);

    if (currentUser) {
      setIsSyncing(true);
      setSyncStatus('syncing');
      try {
        await syncUserProfileToFirestore(currentUser, {
          fullName,
          schoolName,
          classId,
          serieId
        });
        setSyncStatus('synced');
      } catch (e) {
        console.error('Failed to sync profile update to Firestore:', e);
        setSyncStatus('offline');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const recordResult = async (result: LevelSessionResult): Promise<StudentProfile> => {
    // 1. Record locally immediately for instant feedback
    const updated = recordSessionLocally(result);
    setStudent(updated);

    // 2. If user is logged in, asynchronously sync to Firestore
    if (currentUser) {
      setIsSyncing(true);
      setSyncStatus('syncing');
      const subjectKey = `${result.classId}_${result.serieId || 'all'}_${result.subjectId}`;
      const prog = updated.progress[subjectKey];
      if (prog) {
        try {
          await saveProgressToFirestore(
            currentUser.uid,
            subjectKey,
            prog,
            result.classId,
            result.serieId
          );
          setSyncStatus('synced');
        } catch (e) {
          console.error('Failed to save exercise result to Firestore:', e);
          setSyncStatus('offline');
        } finally {
          setIsSyncing(false);
        }
      }
    }

    return updated;
  };

  const refreshCloudData = async () => {
    if (currentUser) {
      await syncUserData(currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        student,
        isLoading,
        isSyncing,
        syncStatus,
        loginWithEmail,
        registerWithEmail,
        registerLocalAccount,
        loginWithGoogle,
        logout,
        updateStudentProfile,
        recordResult,
        refreshCloudData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
