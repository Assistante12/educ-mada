import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { LesonaWorkspace } from './components/LesonaWorkspace';
import { 
  GradeLevel, 
  TerminaleSerie, 
  SubjectInfo, 
  LevelSessionResult,
  BulletinData 
} from './types';
import { generateBulletin } from './utils/storage';

function AppContent() {
  const { 
    student, 
    currentUser, 
    recordResult, 
    updateStudentProfile 
  } = useAuth();

  const [currentView, setCurrentView] = useState<string>('home');
  
  // Active playing selection
  const [activeSubject, setActiveSubject] = useState<SubjectInfo | null>(null);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [sessionResult, setSessionResult] = useState<LevelSessionResult | null>(null);

  // Lesona Workspace selection tracking
  const [lesonaSubjectId, setLesonaSubjectId] = useState<string>('math');
  const [lesonaLevel, setLesonaLevel] = useState<number>(1);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState<boolean>(false);

  // 1. Navigation handlers
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Class / Serie selection confirmation
  const handleConfirmClass = async (grade: GradeLevel, serie?: TerminaleSerie) => {
    await updateStudentProfile(
      student.fullName,
      student.schoolName,
      grade,
      serie
    );
    setCurrentView('subjects');
  };

  // 3. Direct class selection from homepage
  const handleSelectClassFromHome = async (grade: GradeLevel, serie?: TerminaleSerie) => {
    await updateStudentProfile(
      student.fullName,
      student.schoolName,
      grade,
      serie
    );
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
  const handleSessionComplete = async (result: LevelSessionResult) => {
    await recordResult(result);
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
            onOpenLesona={() => handleNavigate('lesona')}
            onOpenLesoka={() => handleNavigate('lesona')}
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
            onSelectSerie={async (newSerie) => {
              await updateStudentProfile(
                student.fullName,
                student.schoolName,
                student.classId,
                newSerie
              );
            }}
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

        {(currentView === 'lesona' || currentView === 'lesoka') && (
          <LesonaWorkspace
            initialGrade={student.classId}
            initialSerie={student.serieId}
            initialSubjectId={lesonaSubjectId}
            initialLevel={lesonaLevel}
            onSwitchToExercises={async (grade, sub, lvl, serie) => {
              await updateStudentProfile(
                student.fullName,
                student.schoolName,
                grade,
                serie
              );
              handleStartLevel(sub, lvl);
            }}
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
          onOpenLesonaWorkspace={(grade, subjectId, level, serie) => {
            setLesonaSubjectId(subjectId);
            setLesonaLevel(level);
            setSessionResult(null);
            setCurrentView('lesona');
          }}
          onOpenLesokaWorkspace={(grade, subjectId, level, serie) => {
            setLesonaSubjectId(subjectId);
            setLesonaLevel(level);
            setSessionResult(null);
            setCurrentView('lesona');
          }}
        />
      )}

      {/* Profile / Registration & Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Official Curriculum & Decrees Info Modal */}
      <CurriculumInfoModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
