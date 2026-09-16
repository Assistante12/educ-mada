import { StudentProfile, LevelSessionResult, BulletinData, GradeLevel, TerminaleSerie } from '../types';
import { OFFICIAL_CURRICULUM } from '../data/curriculumData';

const STORAGE_KEY = 'madagascar_scolaire_student_v1';

export function getStoredStudent(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored student profile:', e);
  }

  // Default initial student profile
  const initial: StudentProfile = {
    id: 'std_' + Math.random().toString(36).substring(2, 9),
    fullName: 'Mpianatra Malagasy',
    email: 'mpianatra@fanabeazana.mg',
    schoolName: 'Lycée / Collège / EPP Madagascar',
    classId: 'Terminale',
    serieId: 'Série S',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    progress: {}
  };

  saveStudent(initial);
  return initial;
}

export function saveStudent(student: StudentProfile): void {
  try {
    student.lastActive = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
  } catch (e) {
    console.error('Failed to save student profile:', e);
  }
}

export function updateStudentProfileInfo(
  fullName: string,
  schoolName: string,
  classId: GradeLevel,
  serieId?: TerminaleSerie
): StudentProfile {
  const current = getStoredStudent();
  current.fullName = fullName;
  current.schoolName = schoolName;
  current.classId = classId;
  current.serieId = classId === 'Terminale' ? (serieId || 'Série S') : undefined;
  saveStudent(current);
  return current;
}

export function recordSessionResult(result: LevelSessionResult): StudentProfile {
  const student = getStoredStudent();
  if (!student.progress) {
    student.progress = {};
  }

  const subjectKey = `${result.classId}_${result.serieId || 'all'}_${result.subjectId}`;
  const existing = student.progress[subjectKey] || {
    subjectId: result.subjectId,
    currentLevel: 1,
    maxUnlockedLevel: 1,
    totalExercisesDone: 0,
    totalCorrect: 0,
    levelScores: {},
    subjectTotalScore: 0,
    averageScore: 0,
    progressionPercent: 10,
    history: []
  };

  if (!existing.levelScores) {
    existing.levelScores = {};
  }

  // 1. Calculate this session's score out of 2 points (Each level = 2 points max, total 10 levels = 20 pts)
  const earnedOutOf2 = typeof result.levelScoreOutOf2 === 'number'
    ? result.levelScoreOutOf2
    : Math.round(((result.correctAnswers / result.totalQuestions) * 2) * 10) / 10;

  result.levelScoreOutOf2 = earnedOutOf2;

  // Keep the student's highest performance on this specific level (out of 2 pts)
  const prevBest = existing.levelScores[result.level] || 0;
  existing.levelScores[result.level] = Math.max(prevBest, earnedOutOf2);

  // 2. Sum up all 10 levels to establish the official subject score SUR 20
  let totalScoreOutOf20 = 0;
  for (let l = 1; l <= 10; l++) {
    totalScoreOutOf20 += existing.levelScores[l] || 0;
  }
  totalScoreOutOf20 = Math.round(totalScoreOutOf20 * 10) / 10;

  existing.subjectTotalScore = totalScoreOutOf20;
  existing.averageScore = totalScoreOutOf20; // Official note /20 for this subject
  result.subjectTotalScoreOutOf20 = totalScoreOutOf20;

  existing.totalExercisesDone += result.totalQuestions;
  existing.totalCorrect += result.correctAnswers;
  existing.history.unshift(result);

  // 3. Level validation rule: A level is validated if student obtains at least 1.2 / 2 points (i.e. 60% / 12 sur 20 rate)
  const isLevelValidated = earnedOutOf2 >= 1.2 || result.status === 'VALIDE';
  result.status = isLevelValidated ? 'VALIDE' : 'REDOUBLE';

  if (isLevelValidated) {
    if (result.level >= existing.maxUnlockedLevel && existing.maxUnlockedLevel < 10) {
      existing.maxUnlockedLevel = result.level + 1;
      existing.currentLevel = existing.maxUnlockedLevel;
    }
  }

  // Cap at 100%
  existing.progressionPercent = Math.min(100, Math.round((existing.maxUnlockedLevel / 10) * 100));

  student.progress[subjectKey] = existing;
  saveStudent(student);
  return student;
}

export function generateBulletin(student: StudentProfile): BulletinData {
  const classCurriculum = OFFICIAL_CURRICULUM[student.classId];
  let subjects = classCurriculum.subjects || [];

  if (student.classId === 'Terminale' && classCurriculum.series && student.serieId) {
    const s = classCurriculum.series.find(ser => ser.id === student.serieId);
    if (s) {
      subjects = s.subjects;
    }
  }

  let totalWeightedScore = 0;
  let totalCoefficients = 0;
  let totalQuestions = 0;
  let totalCorrect = 0;

  const subjectsSummary = subjects.map(sub => {
    const subjectKey = `${student.classId}_${student.serieId || 'all'}_${sub.id}`;
    const prog = student.progress[subjectKey];

    const currentLevel = prog ? prog.maxUnlockedLevel : 1;
    // Official mark sur 20 is the aggregate of the 10 levels
    const averageScore = prog ? (prog.subjectTotalScore ?? prog.averageScore ?? 0) : 0;
    const questionsCount = prog ? prog.totalExercisesDone : 0;
    const correctCount = prog ? prog.totalCorrect : 0;

    totalQuestions += questionsCount;
    totalCorrect += correctCount;

    if (prog && prog.history.length > 0) {
      totalWeightedScore += averageScore * sub.coefficient;
      totalCoefficients += sub.coefficient;
    }

    let status: 'VALIDE' | 'EN_COURS' | 'REDOUBLE' = 'EN_COURS';
    if (prog && prog.history.length > 0) {
      // Official MEN validation: 12 / 20 required on the subject!
      status = averageScore >= 12 ? 'VALIDE' : 'REDOUBLE';
    }

    return {
      subjectId: sub.id,
      subjectName: sub.name,
      coefficient: sub.coefficient,
      currentLevel,
      averageScore,
      totalQuestions: questionsCount,
      correctAnswers: correctCount,
      status
    };
  });

  const generalAverage = totalCoefficients > 0
    ? Math.round((totalWeightedScore / totalCoefficients) * 10) / 10
    : 0;

  let overallStatus: 'VALIDE' | 'REDOUBLE' | 'EN_COURS' = 'EN_COURS';
  if (totalCoefficients > 0) {
    overallStatus = generalAverage >= 12 ? 'VALIDE' : 'REDOUBLE';
  }

  return {
    student,
    date: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    subjectsSummary,
    generalAverage,
    overallStatus,
    totalQuestionsCompleted: totalQuestions,
    totalCorrectAnswers: totalCorrect
  };
}
