export type GradeLevel = 'CM2' | '3ème' | 'Terminale';

export type TerminaleSerie = 'Série L' | 'Série S' | 'Série OSE';

export interface SubjectInfo {
  id: string;
  name: string;
  shortName: string;
  iconName: string;
  coefficient: number;
  description: string;
  themes: string[];
  color: string;
  isNew?: boolean; // New subjects introduced in Madagascar curriculum reform (Sept 2026)
  badgeNote?: string;
}

export interface Question {
  id: string;
  classId: GradeLevel;
  serieId?: TerminaleSerie;
  subjectId: string;
  level: number; // 1 to 10
  theme: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
}

export interface AnswerRecord {
  id: string;
  questionId: string;
  questionText: string;
  selectedOptionIndex: number; // -1 if timed out
  correctOptionIndex: number;
  isCorrect: boolean;
  timeUsedSeconds: number; // up to 600 seconds
  level: number;
  subjectId: string;
  subjectName: string;
  classId: GradeLevel;
  serieId?: TerminaleSerie;
  date: string;
}

export interface LevelSessionResult {
  classId: GradeLevel;
  serieId?: TerminaleSerie;
  subjectId: string;
  level: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  levelScoreOutOf2: number; // Isa azon'ny mpianatra amin'ity niveau ity (0 hatramin'ny 2 points)
  subjectTotalScoreOutOf20: number; // Totalin'ny naoty amin'ny taranja (0 hatramin'ny 20 points)
  scoreOutOf20: number; // Total subject score out of 20
  percentage: number;
  status: 'VALIDE' | 'REDOUBLE';
  completedAt: string;
  answers: AnswerRecord[];
}

export interface SubjectProgress {
  subjectId: string;
  currentLevel: number; // 1 to 10
  maxUnlockedLevel: number; // 1 to 10
  totalExercisesDone: number;
  totalCorrect: number;
  levelScores: Record<number, number>; // Isa isaky ny niveau (1..10), tsirairay avy dia /2 pts (Total = /20)
  subjectTotalScore: number; // Fitambaran'ny isa amin'ny taranja (/20)
  averageScore: number; // Fitambaran'ny isa amin'ny taranja (/20)
  progressionPercent: number; // based on currentLevel / 10
  history: LevelSessionResult[];
}

export interface StudentProfile {
  id: string;
  uid?: string;
  fullName: string;
  email: string;
  schoolName: string;
  classId: GradeLevel;
  serieId?: TerminaleSerie;
  createdAt: string;
  lastActive: string;
  photoURL?: string;
  isAnonymous?: boolean;
  authProvider?: string;
  progress: Record<string, SubjectProgress>;
}

export interface BulletinData {
  student: StudentProfile;
  date: string;
  subjectsSummary: {
    subjectId: string;
    subjectName: string;
    coefficient: number;
    currentLevel: number;
    averageScore: number;
    totalQuestions: number;
    correctAnswers: number;
    status: 'VALIDE' | 'EN_COURS' | 'REDOUBLE';
  }[];
  generalAverage: number;
  overallStatus: 'VALIDE' | 'REDOUBLE' | 'EN_COURS';
  totalQuestionsCompleted: number;
  totalCorrectAnswers: number;
}

export interface CommonMistake {
  mistake: string;
  explanation: string;
  correction: string;
}

export interface LessonRemediation {
  id: string;
  classId: GradeLevel;
  serieId?: TerminaleSerie;
  subjectId: string;
  subjectName: string;
  level: number;
  title: string;
  theme: string;
  objectives: string[];
  coreTheory: string[];
  commonMistakes: CommonMistake[];
  methodology: string[];
  solvedExample: {
    problem: string;
    steps: string[];
    finalAnswer: string;
  };
  keyTakeaways: string[];
  officialReference: string;
  language?: 'fr' | 'mg';
  source?: 'firestore_cache' | 'ai_generated' | 'curriculum_fallback' | 'curriculum_database';
  cachedAt?: string;
}
