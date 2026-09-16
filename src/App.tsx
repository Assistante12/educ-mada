import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ClassSelector } from './components/ClassSelector';
import { SubjectSelector } from './components/SubjectSelector';
import { ExerciseView } from './components/ExerciseView';
import { LevelResultModal } from './components/LevelResultModal';
import { StudentDashboard } from './components/StudentDashboard';
import { BulletinView } from './components/BulletinView';
import { AuthModal } from './components/AuthModal';
import { CurriculumInfoModal } from './components/CurriculumInfoModal';
import { 
  GradeLevel, 
  TerminaleSerie, 
  SubjectInfo, 
  StudentProfile, 
  LevelSessionResult,
  BulletinData 
} from './types';
import { 
  getStoredStudent, 
  updateStudentProfileInfo, 
  recordSessionResult, 
  generateBulletin 
} from './utils/storage';
import { OFFICIAL_CURRICULUM } from './data/curriculumData';

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(getStoredStudent());
  const [currentView, setCurrentView] = useState<string>('home');
  
  // Active playing selection
  const [activeSubject, setActiveSubject] = useState<SubjectInfo | null>(null);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [sessionResult, setSessionResult] = useState<LevelSessionResult | null>(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState<boolean>(false);

  // Refresh student profile
  const refreshStudent = () => {
    setStudent(getStoredStudent());
  };

  // 1. Navigation handlers
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Class / Serie selection confirmation
  const handleConfirmClass = (grade: GradeLevel, serie?: TerminaleSerie) => {
    const updated = updateStudentProfileInfo(
      student.fullName,
      student.schoolName,
      grade,
      serie
    );
    setStudent(updated);
    setCurrentView('subjects');
  };

  // 3. Direct class selection from homepage
  const handleSelectClassFromHome = (grade: GradeLevel, serie?: TerminaleSerie) => {
    const updated = updateStudentProfileInfo(
      student.fullName,
      student.schoolName,
      grade,
      serie
    );
    setStudent(updated);
    setCurrentView('subjects');
  };

  // 4. Start level exercise
  const handleStartLevel = (subject: SubjectInfo, level: number) => {
    setActiveSubject(subject);
    setActiveLevel(level);
    setSessionResult(null);
    setCurrentView('exercise');
  };

  // 5. When exercise session finishes
  const handleSessionComplete = (result: LevelSessionResult) => {
    const updated = recordSessionResult(result);
    setStudent(updated);
    setSessionResult(result);
  };

  // 6. Modal actions
  const handleNextLevel = () => {
    if (!sessionResult || !activeSubject) return;
    const nextLvl = sessionResult.level + 1;
    setSessionResult(null);
    if (nextLvl <= 10) {
      handleStartLevel(activeSubject, nextLvl);
    } else {
      setCurrentView('bulletin');
    }
  };

  const handleRetryLevel = () => {
    if (!sessionResult || !activeSubject) return;
    const currentLvl = sessionResult.level;
    setSessionResult(null);
    handleStartLevel(activeSubject, currentLvl);
  };

  const handleSaveProfile = (
    fullName: string, 
    schoolName: string, 
    classId: GradeLevel, 
    serieId?: TerminaleSerie
  ) => {
    const updated = updateStudentProfileInfo(fullName, schoolName, classId, serieId);
    setStudent(updated);
  };

  const bulletinData: BulletinData = generateBulletin(student);

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Header */}
      <Header
        student={student}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenProfile={() => setIsAuthModalOpen(true)}
        onOpenCurriculumInfo={() => setIsCurriculumModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onStart={() => setCurrentView('classes')}
            onLogin={() => setIsAuthModalOpen(true)}
            onSelectClass={handleSelectClassFromHome}
            onOpenCurriculumInfo={() => setIsCurriculumModalOpen(true)}
          />
        )}

        {currentView === 'classes' && (
          <ClassSelector
            currentClass={student.classId}
            currentSerie={student.serieId}
            onConfirmSelection={handleConfirmClass}
          />
        )}

        {currentView === 'subjects' && (
          <SubjectSelector
            grade={student.classId}
            serie={student.serieId}
            student={student}
            onChangeClass={() => setCurrentView('classes')}
            onSelectLevelToPlay={handleStartLevel}
          />
        )}

        {currentView === 'exercise' && activeSubject && (
          <ExerciseView
            grade={student.classId}
            serie={student.serieId}
            subject={activeSubject}
            level={activeLevel}
            onSessionComplete={handleSessionComplete}
            onQuit={() => setCurrentView('subjects')}
          />
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard
            student={student}
            onContinueSubject={(sub, lvl) => handleStartLevel(sub, lvl)}
            onViewBulletin={() => setCurrentView('bulletin')}
            onChangeClass={() => setCurrentView('classes')}
          />
        )}

        {currentView === 'bulletin' && (
          <BulletinView
            bulletin={bulletinData}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Level Result Modal with strict 12/20 rule decision */}
      {sessionResult && (
        <LevelResultModal
          result={sessionResult}
          onNextLevel={handleNextLevel}
          onRetryLevel={handleRetryLevel}
          onGoToSubjects={() => {
            setSessionResult(null);
            setCurrentView('subjects');
          }}
          onViewBulletin={() => {
            setSessionResult(null);
            setCurrentView('bulletin');
          }}
        />
      )}

      {/* Profile / Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        student={student}
        onSave={handleSaveProfile}
      />

      {/* Official Curriculum & Decrees Info Modal */}
      <CurriculumInfoModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
      />
    </div>
  );
}
