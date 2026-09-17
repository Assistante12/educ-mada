import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db, FirebaseUser } from './firebase';
import { StudentProfile, SubjectProgress, GradeLevel, TerminaleSerie, LessonRemediation } from '../types';

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

/**
 * Check if a lesson is an obsolete generic guideline placeholder
 * (e.g. contains boilerplate advice instead of actual subject lesson content)
 */
export function isBogusGenericLesson(lesson: LessonRemediation | null | undefined): boolean {
  if (!lesson) return true;
  const theoryStr = Array.isArray(lesson.coreTheory) ? lesson.coreTheory.join(' ') : '';
  const mistakeStr = Array.isArray(lesson.commonMistakes) ? JSON.stringify(lesson.commonMistakes) : '';
  const methodStr = Array.isArray(lesson.methodology) ? lesson.methodology.join(' ') : '';
  const exampleStr = typeof lesson.solvedExample === 'object' ? JSON.stringify(lesson.solvedExample) : '';

  if (
    theoryStr.includes("Tsy maintsy fantarina mialoha ny hevitra fototra") ||
    theoryStr.includes("Ampiasao ara-dalàna ny fomba fiasa nomena") ||
    mistakeStr.includes("Firosoana avy hatrany amin'ny valiny tsy misy famakafakana") ||
    mistakeStr.includes("Omeo 2 minitra foana ny tenanao hamarinana") ||
    methodStr.includes("Dingana 1 : Fakafakao ny angon-drakitra sy ny zava-kendrena") ||
    exampleStr.includes("Valiny marina sy voadinika manaraka ny marika ofisialy") ||
    exampleStr.includes("Famaritana ny fepetra sy ny zavatra fantatra ao amin'ny lesona")
  ) {
    return true;
  }
  return false;
}

/**
 * Generate a clean document ID for Firestore caching of lessons
 */
export function getLessonDocId(
  classId: GradeLevel,
  subjectId: string,
  level: number,
  serieId?: TerminaleSerie,
  language: 'fr' | 'mg' = 'fr'
): string {
  const cleanSerie = serieId ? serieId.replace(/[^a-zA-Z0-9]/g, '_') : 'all';
  const cleanClass = classId.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanSubject = subjectId.replace(/[^a-zA-Z0-9]/g, '_');
  return `lesson_${cleanClass}_${cleanSerie}_${cleanSubject}_lvl${level}_${language}`;
}

/**
 * Fetch a cached lesson from Firestore
 * Returns null if not cached yet or if cached copy is an obsolete placeholder.
 */
export async function getCachedLessonFromFirestore(
  classId: GradeLevel,
  subjectId: string,
  level: number,
  serieId?: TerminaleSerie,
  language: 'fr' | 'mg' = 'fr'
): Promise<LessonRemediation | null> {
  try {
    const docId = getLessonDocId(classId, subjectId, level, serieId, language);
    const docRef = doc(db, 'lessons', docId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as LessonRemediation;
      if (isBogusGenericLesson(data)) {
        console.warn(`[Firestore Cache Hit] Found obsolete generic placeholder in ${docId}. Ignoring.`);
        return null;
      }
      console.log(`[Firestore Cache Hit] Found verified cached lesson: ${docId}`);
      return {
        ...data,
        source: 'firestore_cache'
      };
    }
  } catch (err) {
    console.warn('[Firestore Cache Check] Error querying cached lesson:', err);
  }
  return null;
}

/**
 * Save an AI-generated or official curriculum lesson directly to Firestore
 * so future requests load immediately from the database without invoking AI.
 */
export async function saveLessonToFirestore(lesson: LessonRemediation): Promise<void> {
  if (isBogusGenericLesson(lesson)) {
    console.warn('[Firestore Cache Save] Refusing to save generic placeholder.');
    return;
  }

  try {
    const lang = lesson.language || (lesson.subjectId.toLowerCase().includes('malagasy') ? 'mg' : 'fr');
    const docId = getLessonDocId(lesson.classId, lesson.subjectId, lesson.level, lesson.serieId, lang);
    const docRef = doc(db, 'lessons', docId);

    const dataToSave = {
      ...lesson,
      language: lang,
      cachedAt: new Date().toISOString(),
      source: 'firestore_cache'
    };

    await setDoc(docRef, dataToSave, { merge: true });
    console.log(`[Firestore Cache Save] Successfully saved lesson to Firestore: ${docId}`);
  } catch (err) {
    console.warn('[Firestore Cache Save] Failed to save lesson to Firestore:', err);
  }
}

