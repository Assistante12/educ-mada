import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db, FirebaseUser } from './firebase';
import { StudentProfile, SubjectProgress, GradeLevel, TerminaleSerie } from '../types';

export interface FirestoreUserProfile {
  uid: string;
  email: string;
  fullName: string;
  schoolName: string;
  classId: GradeLevel;
  serieId?: TerminaleSerie;
  role?: string;
  avatar?: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
}

/**
 * Save or update user profile in Firestore
 */
export async function syncUserProfileToFirestore(
  user: FirebaseUser,
  extra: {
    fullName?: string;
    schoolName?: string;
    classId?: GradeLevel;
    serieId?: TerminaleSerie;
  }
): Promise<FirestoreUserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const existingSnap = await getDoc(userRef);

  let profileData: FirestoreUserProfile;

  if (existingSnap.exists()) {
    const prev = existingSnap.data() as FirestoreUserProfile;
    profileData = {
      ...prev,
      email: user.email || prev.email || '',
      fullName: extra.fullName || prev.fullName || user.displayName || 'Mpianatra Malagasy',
      schoolName: extra.schoolName || prev.schoolName || 'Lycée / Collège / EPP Madagascar',
      classId: extra.classId || prev.classId || 'Terminale',
      serieId: extra.classId === 'Terminale' ? (extra.serieId || prev.serieId || 'Série S') : undefined,
      lastLoginAt: new Date().toISOString(),
      photoURL: user.photoURL || prev.photoURL || undefined
    };
  } else {
    profileData = {
      uid: user.uid,
      email: user.email || '',
      fullName: extra.fullName || user.displayName || 'Mpianatra Malagasy',
      schoolName: extra.schoolName || 'Lycée / Collège / EPP Madagascar',
      classId: extra.classId || 'Terminale',
      serieId: extra.classId === 'Terminale' ? (extra.serieId || 'Série S') : undefined,
      role: 'student',
      photoURL: user.photoURL || undefined,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
  }

  await setDoc(userRef, profileData, { merge: true });
  return profileData;
}

/**
 * Fetch user profile from Firestore
 */
export async function fetchUserProfileFromFirestore(uid: string): Promise<FirestoreUserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserProfile;
    }
  } catch (err) {
    console.error('Error fetching user profile from Firestore:', err);
  }
  return null;
}

/**
 * Save a single subject progress to Firestore under /users/{uid}/progress/{subjectKey}
 */
export async function saveProgressToFirestore(
  uid: string,
  subjectKey: string,
  progress: SubjectProgress,
  grade: GradeLevel,
  serieId?: TerminaleSerie
): Promise<void> {
  try {
    const progressRef = doc(db, 'users', uid, 'progress', subjectKey);
    // Sanitize progress object for Firestore
    const dataToSave = {
      userId: uid,
      subjectKey,
      subjectId: progress.subjectId,
      grade,
      serieId: serieId || null,
      currentLevel: progress.currentLevel,
      maxUnlockedLevel: progress.maxUnlockedLevel,
      totalExercisesDone: progress.totalExercisesDone,
      totalCorrect: progress.totalCorrect,
      levelScores: progress.levelScores || {},
      subjectTotalScore: progress.subjectTotalScore ?? progress.averageScore ?? 0,
      averageScore: progress.averageScore ?? 0,
      progressionPercent: progress.progressionPercent,
      updatedAt: new Date().toISOString()
    };

    await setDoc(progressRef, dataToSave, { merge: true });
  } catch (err) {
    console.error(`Failed to save progress to Firestore for ${subjectKey}:`, err);
  }
}

/**
 * Fetch all subject progresses for a user from Firestore subcollection
 */
export async function fetchUserProgressFromFirestore(
  uid: string
): Promise<Record<string, SubjectProgress>> {
  const result: Record<string, SubjectProgress> = {};
  try {
    const colRef = collection(db, 'users', uid, 'progress');
    const snap = await getDocs(colRef);

    snap.forEach((docItem) => {
      const d = docItem.data();
      const subjectKey = docItem.id;
      result[subjectKey] = {
        subjectId: d.subjectId || '',
        currentLevel: d.currentLevel || 1,
        maxUnlockedLevel: d.maxUnlockedLevel || 1,
        totalExercisesDone: d.totalExercisesDone || 0,
        totalCorrect: d.totalCorrect || 0,
        levelScores: d.levelScores || {},
        subjectTotalScore: d.subjectTotalScore ?? d.averageScore ?? 0,
        averageScore: d.averageScore ?? 0,
        progressionPercent: d.progressionPercent || 10,
        history: []
      };
    });
  } catch (err) {
    console.error('Failed to fetch user progress from Firestore:', err);
  }
  return result;
}

/**
 * Batch upload local progress to Firestore when user registers or logs in
 */
export async function uploadLocalProgressToFirestore(
  uid: string,
  localStudent: StudentProfile
): Promise<void> {
  try {
    if (!localStudent.progress) return;
    const entries = Object.entries(localStudent.progress);
    for (const [key, prog] of entries) {
      await saveProgressToFirestore(
        uid,
        key,
        prog,
        localStudent.classId,
        localStudent.serieId
      );
    }
  } catch (err) {
    console.error('Error uploading local progress to Firestore:', err);
  }
}
