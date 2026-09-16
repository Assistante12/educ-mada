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
  scoreOutOf20: number;
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
  averageScore: number; // /20
  progressionPercent: number; // based on currentLevel / 10
  history: LevelSessionResult[];
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  classId: GradeLevel;
  serieId?: TerminaleSerie;
  createdAt: string;
  lastActive: string;
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
