
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronDown, ChevronRight, BookOpen, PlayCircle, Code2 as CodeIcon, MonitorPlay, Film, Terminal,
  ArrowLeft, ArrowRight, Lightbulb, Loader2, AlertCircle, RotateCcw, GraduationCap, Star, CheckCircle2, XCircle, Lock, Unlock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { rewriteQuizQuestion, RewriteQuizQuestionInput } from '@/ai/flows/rewrite-quiz-question';
import courseDataFromFile from '@/data/courseData';

// --- Type Definitions based on courseData.js ---

interface QuizAnswer {
  text: string;
  value: number;
}

interface QuizQuestion {
  text: string;
  type: 'option' | 'blank' | 'blank_options' | string; // Added 'blank_options' & string
  answers: QuizAnswer[];
  answer: string; 
  hint?: string;
  success?: string;
  failed?: string;
}

interface BaseTaskMetadata {
  caption: string;
  difficulty: number;
  hint?: string;
  hints?: Array<{ cost?: number; text: string }>;
  tag?: string[];
  faqs?: string[];
  intro?: string;
  problem?: string;
  // Fields from schema not in original data structure or covered by specific task types:
  // update_difficulty?: boolean; // Assuming this is handled externally or not directly rendered
}

interface HtmlTaskMetadata extends BaseTaskMetadata {
  questions?: QuizQuestion[];
  multi_choice?: boolean; // Already part of QuizQuestion if needed, or general flag
  precode?: string; // For blank type, not an object as in schema's generic precode
  answer?: string;  // For blank type, not an array as in schema's generic answer
  // type?: string; // This is on QuizQuestion, not directly on HtmlTaskMetadata for quizzes
}

interface AdsTaskMetadata extends BaseTaskMetadata {
  video: string;
  video_source?: string;
}

interface CodeEvent {
  caption: string;
  key: string;
}
interface CodeTaskMetadata extends BaseTaskMetadata {
  precode: { [key: string]: string } | string; // Schema allows object, data has string for general, object for code_blank
  code_language?: string; // From schema
  language?: string; // From existing data
  answer?: Array<{ [key: string]: string }>; // From schema
  solution?: { [key: string]: { [key: string]: string[] } }; // From schema
  auto_verify?: boolean; // From schema
  verification_type?: string; // From schema
  drawing?: boolean; // From schema
  publish_web?: boolean; // From schema
  events?: CodeEvent[]; // From schema
}

interface BaseTypedTask<TType extends string, TMetadata extends BaseTaskMetadata> {
  task_type: TType;
  action?: 'lecture' | 'quiz' | 'text' | 'blank' | 'code_blank' | 'code'; // Added 'text', 'blank', 'code_blank', 'code'
  metadata: TMetadata;
  // code_language from schema is on metadata for code tasks
}

type HtmlTask = BaseTypedTask<'html', HtmlTaskMetadata>;
type AdsTask = BaseTypedTask<'ads', AdsTaskMetadata>;
type CodeTask = BaseTypedTask<'code', CodeTaskMetadata>;

type Task = HtmlTask | AdsTask | CodeTask;

interface Lesson {
  lesson_id: number;
  lesson_title: string;
  aim: string;
  description?: string;
  what_students_will_build?: string;
  concepts_learned?: string[];
  tasks: Task[];
}

interface Module {
  module_id: number;
  module_title: string;
  aim?: string;
  description?: string;
  what_students_will_build?: string;
  concepts_learned?: string[];
  lessons: Lesson[];
}

interface Course {
  course_name: string;
  age_group?: string;
  learning_goals?: string[];
  modules: Module[];
}

const courseData: Course = courseDataFromFile;

const getTaskId = (lessonId: number, taskIndex: number) => `${lessonId}-${taskIndex}`;

// --- Main App Component ---
function CoursePilotApp() {
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(courseData.modules[0]?.module_id || null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(courseData.modules[0]?.lessons[0]?.lesson_id || null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ question: string; studentAnswer: string; rewrittenQuestion: string | null } | null>(null);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [taskCompletionStatus, setTaskCompletionStatus] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const selectedModule = useMemo(() => {
    if (!selectedModuleId) return null;
    return courseData.modules.find(m => m.module_id === selectedModuleId) || null;
  }, [selectedModuleId]);
  
  const selectedLesson = useMemo(() => {
    if (!selectedLessonId || !selectedModule) return null;
    return selectedModule.lessons.find(l => l.lesson_id === selectedLessonId) || null;
  }, [selectedLessonId, selectedModule]);

  const currentTask = useMemo(() => {
    return selectedLesson?.tasks[selectedTaskIndex] || null;
  }, [selectedLesson, selectedTaskIndex]);

  const currentTaskId = useMemo(() => {
    if (selectedLessonId === null || !currentTask) return '';
    return getTaskId(selectedLessonId, selectedTaskIndex);
  }, [selectedLessonId, currentTask, selectedTaskIndex]);

  const isTaskConsideredSolved = useCallback((lessonId: number, taskIndex: number): boolean => {
    const taskId = getTaskId(lessonId, taskIndex);
    const task = courseData.modules
        .flatMap(m => m.lessons)
        .find(l => l.lesson_id === lessonId)
        ?.tasks[taskIndex];

    if (!task) return false;
    
    // Lecture or ads tasks are solved on view
    if (task.task_type === 'ads' || (task.task_type === 'html' && (task.action === 'lecture' || task.action === 'text'))) {
        return true;
    }
    return !!taskCompletionStatus[taskId];
  }, [taskCompletionStatus]);

  const isLessonComplete = useCallback((lessonId: number): boolean => {
    const lesson = courseData.modules.flatMap(m => m.lessons).find(l => l.lesson_id === lessonId);
    if (!lesson) return false;
    return lesson.tasks.every((_, taskIndex) => isTaskConsideredSolved(lessonId, taskIndex));
  }, [isTaskConsideredSolved]);

  const isModuleComplete = useCallback((moduleId: number): boolean => {
    const module = courseData.modules.find(m => m.module_id === moduleId);
    if (!module) return false;
    return module.lessons.every(lesson => isLessonComplete(lesson.lesson_id));
  }, [isLessonComplete]);

  const isLessonUnlocked = useCallback((lessonId: number, moduleId: number): boolean => {
    const moduleIndex = courseData.modules.findIndex(m => m.module_id === moduleId);
    const currentModule = courseData.modules[moduleIndex];
    if (!currentModule) return false;
    const lessonIndex = currentModule.lessons.findIndex(l => l.lesson_id === lessonId);

    if (moduleIndex === 0 && lessonIndex === 0) return true; // First lesson of first module

    if (lessonIndex === 0) { // First lesson of a module
      if (moduleIndex === 0) return true; // Should be covered by above, but for safety
      const prevModule = courseData.modules[moduleIndex - 1];
      return prevModule ? isModuleComplete(prevModule.module_id) : false;
    }
    
    // Not the first lesson in the module
    const prevLesson = currentModule.lessons[lessonIndex - 1];
    return prevLesson ? isLessonComplete(prevLesson.lesson_id) : false;
  }, [isModuleComplete, isLessonComplete]);

  const isModuleUnlocked = useCallback((moduleId: number): boolean => {
    const moduleIndex = courseData.modules.findIndex(m => m.module_id === moduleId);
    if (moduleIndex === 0) return true; // First module is always unlocked
    const prevModule = courseData.modules[moduleIndex - 1];
    return prevModule ? isModuleComplete(prevModule.module_id) : false;
  }, [isModuleComplete]);


  const markTaskAsSolved = useCallback(() => {
    if (currentTaskId) {
      setTaskCompletionStatus(prev => ({ ...prev, [currentTaskId]: true }));
    }
  }, [currentTaskId]);

  useEffect(() => {
    // Automatically mark lecture/ads tasks as solved when they become current if they are part of the selected lesson
    if (selectedLesson && currentTask && (currentTask.task_type === 'ads' || (currentTask.task_type === 'html' && (currentTask.action === 'lecture' || currentTask.action === 'text')))) {
      if (currentTaskId && !taskCompletionStatus[currentTaskId]) {
         // Check if the task's lesson is the currently selected one
        if (selectedLessonId === selectedLesson.lesson_id) {
            markTaskAsSolved();
        }
      }
    }
  }, [currentTask, currentTaskId, markTaskAsSolved, taskCompletionStatus, selectedLesson, selectedLessonId]);

  const handleLessonClick = (lessonId: number, moduleId: number) => {
    if (!isLessonUnlocked(lessonId, moduleId)) {
      toast({
        title: "Lesson Locked",
        description: "Complete previous lessons to unlock this one.",
        variant: "destructive",
        icon: <Lock className="h-5 w-5" />
      });
      return;
    }
    setSelectedLessonId(lessonId);
    setSelectedModuleId(moduleId);
    setSelectedTaskIndex(0);
    setQuizFeedback(null);
  };

  const handleNextTask = () => {
    if (selectedLesson && selectedTaskIndex < selectedLesson.tasks.length - 1) {
      if (isTaskConsideredSolved(selectedLesson.lesson_id, selectedTaskIndex)) {
        setSelectedTaskIndex(prev => prev + 1);
        setQuizFeedback(null);
      } else {
        toast({
          title: "Task Not Completed",
          description: "Please complete the current task before moving to the next one.",
          variant: "destructive",
        });
      }
    } else if (selectedLesson && selectedTaskIndex === selectedLesson.tasks.length - 1 && isTaskConsideredSolved(selectedLesson.lesson_id, selectedTaskIndex)) {
      // Last task of the lesson is solved, potentially unlock next lesson or show completion message
      toast({
        title: "Lesson Complete!",
        description: "You've finished all tasks in this lesson.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
      // Optionally, auto-navigate to next unlocked lesson or module overview
    }
  };

  const handlePrevTask = () => {
    if (selectedTaskIndex > 0) {
      setSelectedTaskIndex(prev => prev - 1);
      setQuizFeedback(null);
    }
  };

  const handleQuizAnswer = async (question: QuizQuestion, studentAnswer: QuizAnswer) => {
    const questionText = question.text;
    const studentAnswerText = studentAnswer.text;
    const isCorrect = studentAnswer.value.toString() === question.answer;

    if (isCorrect) {
      setQuizFeedback(null);
      if (currentTaskId) markTaskAsSolved();
      toast({
        title: question.success || "Correct!",
        description: "Great job!",
        variant: "default",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
    } else {
      if (!selectedLesson || !currentTask) return;
      setIsAILoading(true);
      setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: "Thinking of a hint..." });
      try {
        const lessonContentForAI = selectedLesson.aim + "\n" + (selectedLesson.description || "") + "\n" +
          selectedLesson.tasks.map(t => t.metadata.problem || t.metadata.intro || t.metadata.caption).join("\n\n");

        const input: RewriteQuizQuestionInput = {
          question: questionText,
          studentAnswer: studentAnswerText,
          lessonContent: lessonContentForAI,
        };
        const result = await rewriteQuizQuestion(input);
        setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: result.rewrittenQuestion });
        toast({
            title: question.failed || "Not quite!",
            description: "Here's a hint to help you.",
            variant: "destructive",
            icon: <XCircle className="h-5 w-5 text-red-500" />,
        });
      } catch (error) {
        console.error("AI Error:", error);
        toast({
          title: "Error getting hint",
          description: "Could not generate a hint at this time.",
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
        setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: "Could not load hint." });
      } finally {
        setIsAILoading(false);
      }
    }
  };
  
  const handleGenericSubmit = (isCorrect: boolean, successMsg?: string, failedMsg?: string, solveTask: boolean = true) => {
    if (isCorrect) {
      if(solveTask && currentTaskId) markTaskAsSolved();
      toast({
        title: successMsg || "Correct!",
        description: "Well done!",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
    } else {
      toast({
        title: failedMsg || "Not quite!",
        description: "Try that again.",
        variant: "destructive",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    }
  };
  
  const currentTaskIsSolved = isTaskConsideredSolved(selectedLessonId!, selectedTaskIndex);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <CourseSidebar
        courseName={courseData.course_name}
        modules={courseData.modules}
        selectedLessonId={selectedLessonId}
        selectedModuleId={selectedModuleId}
        onLessonClick={handleLessonClick}
        isLessonUnlocked={isLessonUnlocked}
        isModuleUnlocked={isModuleUnlocked}
        isLessonComplete={isLessonComplete}
      />
      <MainContentArea
        selectedLesson={selectedLesson}
        currentTask={currentTask}
        selectedTaskIndex={selectedTaskIndex}
        onQuizAnswer={handleQuizAnswer}
        onGenericSubmit={handleGenericSubmit}
        quizFeedback={quizFeedback}
        isAILoading={isAILoading}
        clearQuizFeedback={() => setQuizFeedback(null)}
        onNextTask={handleNextTask}
        onPrevTask={handlePrevTask}
        markTaskAsSolved={markTaskAsSolved} 
        isCurrentTaskSolved={currentTaskIsSolved}
      />
    </div>
  );
}

// --- Modular Components ---

interface CourseSidebarProps {
  courseName: string;
  modules: Module[];
  selectedLessonId: number | null;
  selectedModuleId: number | null;
  onLessonClick: (lessonId: number, moduleId: number) => void;
  isLessonUnlocked: (lessonId: number, moduleId: number) => boolean;
  isModuleUnlocked: (moduleId: number) => boolean;
  isLessonComplete: (lessonId: number) => boolean;
}

function CourseSidebar({ courseName, modules, selectedLessonId, selectedModuleId, onLessonClick, isLessonUnlocked, isModuleUnlocked, isLessonComplete }: CourseSidebarProps) {
  return (
    <aside className="w-80 fixed top-0 left-0 h-full bg-card border-r border-border shadow-md flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-headline font-semibold text-primary flex items-center">
          <GraduationCap className="mr-2 h-7 w-7" />
          {courseName}
        </h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {modules.map(module => (
          <ModuleAccordion
            key={module.module_id}
            module={module}
            selectedLessonId={selectedLessonId}
            onLessonClick={onLessonClick}
            isActiveModule={selectedModuleId === module.module_id}
            isModuleUnlocked={isModuleUnlocked(module.module_id)}
            isLessonUnlocked={isLessonUnlocked}
            isLessonComplete={isLessonComplete}
            selectedModuleId={selectedModuleId}
          />
        ))}
      </nav>
    </aside>
  );
}

interface MainContentAreaProps {
  selectedLesson: Lesson | null;
  currentTask: Task | null;
  selectedTaskIndex: number;
  onQuizAnswer: (question: QuizQuestion, studentAnswer: QuizAnswer) => void;
  onGenericSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string, solveTask?: boolean) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
  onNextTask: () => void;
  onPrevTask: () => void;
  markTaskAsSolved: () => void;
  isCurrentTaskSolved: boolean;
}

function MainContentArea({
  selectedLesson, currentTask, selectedTaskIndex, 
  onQuizAnswer, onGenericSubmit, quizFeedback, isAILoading, clearQuizFeedback,
  onNextTask, onPrevTask, markTaskAsSolved, isCurrentTaskSolved
}: MainContentAreaProps) {
  if (!selectedLesson || !currentTask) {
    return (
      <main className="flex-1 ml-80 p-8 overflow-y-auto">
        <WelcomeMessage />
      </main>
    );
  }

  return (
    <main className="flex-1 ml-80 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <LessonHeaderDisplay lesson={selectedLesson} />
        <TaskViewer
          task={currentTask}
          lessonId={selectedLesson.lesson_id}
          taskIndex={selectedTaskIndex}
          onQuizAnswer={onQuizAnswer}
          onGenericSubmit={onGenericSubmit}
          quizFeedback={quizFeedback}
          isAILoading={isAILoading}
          clearQuizFeedback={clearQuizFeedback}
          markTaskAsSolved={markTaskAsSolved}
        />
        <TaskNavigationControls
          onPrevTask={onPrevTask}
          onNextTask={onNextTask}
          selectedTaskIndex={selectedTaskIndex}
          totalTasks={selectedLesson.tasks.length}
          isCurrentTaskSolved={isCurrentTaskSolved}
        />
      </div>
    </main>
  );
}

interface LessonHeaderDisplayProps {
  lesson: Lesson;
}

function LessonHeaderDisplay({ lesson }: LessonHeaderDisplayProps) {
  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">{lesson.lesson_title}</CardTitle>
        <CardDescription className="text-base text-muted-foreground font-body italic pt-1">
          <strong>Aim:</strong> {lesson.aim}
        </CardDescription>
        {lesson.description && <p className="text-sm text-muted-foreground pt-2">{lesson.description}</p>}
      </CardHeader>
    </Card>
  );
}

interface TaskNavigationControlsProps {
  onPrevTask: () => void;
  onNextTask: () => void;
  selectedTaskIndex: number;
  totalTasks: number;
  isCurrentTaskSolved: boolean;
}

function TaskNavigationControls({ onPrevTask, onNextTask, selectedTaskIndex, totalTasks, isCurrentTaskSolved }: TaskNavigationControlsProps) {
  const isLastTask = selectedTaskIndex === totalTasks - 1;
  return (
    <div className="mt-8 flex justify-between items-center">
      <Button
        onClick={onPrevTask}
        disabled={selectedTaskIndex === 0}
        variant="outline"
        className="hover:bg-accent hover:text-accent-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <span className="text-sm text-muted-foreground font-body">
        Task {selectedTaskIndex + 1} of {totalTasks}
      </span>
      <Button
        onClick={onNextTask}
        disabled={isLastTask ? !isCurrentTaskSolved : !isCurrentTaskSolved}
        variant="outline"
        className="hover:bg-accent hover:text-accent-foreground"
        title={!isCurrentTaskSolved ? "Complete current task to proceed" : (isLastTask ? "Lesson Complete!" : undefined)}
      >
        {isLastTask ? "Finish Lesson" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}


// --- Sidebar Components (ModuleAccordion, LessonItem) ---
interface ModuleAccordionProps {
  module: Module;
  selectedLessonId: number | null;
  selectedModuleId: number | null;
  onLessonClick: (lessonId: number, moduleId: number) => void;
  isActiveModule: boolean;
  isModuleUnlocked: boolean;
  isLessonUnlocked: (lessonId: number, moduleId: number) => boolean;
  isLessonComplete: (lessonId: number) => boolean;
}

function ModuleAccordion({ module, selectedLessonId, onLessonClick, isActiveModule, isModuleUnlocked, isLessonUnlocked, isLessonComplete, selectedModuleId }: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(isActiveModule && isModuleUnlocked);
  const { toast } = useToast();

  useEffect(() => {
    // Open if it's the active module AND it's unlocked.
    // Also, keep it open if it was already open and remains unlocked.
    // If a module becomes locked (which shouldn't happen with linear progression), it should close.
    if (isModuleUnlocked) {
        setIsOpen(prevOpenState => (isActiveModule ? true : prevOpenState));
    } else {
        setIsOpen(false);
    }
  }, [isActiveModule, isModuleUnlocked]);


  const toggleOpen = () => {
    if (!isModuleUnlocked) {
      toast({
        title: "Module Locked",
        description: "Complete the previous module to unlock this one.",
        variant: "destructive",
        icon: <Lock className="h-5 w-5" />
      });
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`rounded-md border border-border shadow-sm transition-all duration-300 ease-in-out ${!isModuleUnlocked ? 'opacity-70 bg-muted/30' : ''}`}>
      <button
        onClick={toggleOpen}
        aria-expanded={isOpen && isModuleUnlocked}
        disabled={!isModuleUnlocked && !isActiveModule} // Allow clicking active (likely first) module even if logic for others is WIP
        className={`w-full flex items-center justify-between p-4 text-left font-headline font-medium text-lg 
                    ${isModuleUnlocked ? 'hover:bg-accent transition-colors duration-200' : 'cursor-not-allowed'} rounded-t-md`}
        aria-controls={`module-${module.module_id}-content`}
      >
        <span className="flex items-center">
          {!isModuleUnlocked && <Lock className="mr-2 h-4 w-4 text-muted-foreground" />}
          {module.module_title}
        </span>
        {isModuleUnlocked && (isOpen ? <ChevronDown className="h-5 w-5 text-primary" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />)}
      </button>
      {isModuleUnlocked && (
        <div
          id={`module-${module.module_id}-content`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
        >
          <ul className="p-2 space-y-1 bg-background rounded-b-md">
            {module.lessons.map(lesson => (
              <LessonItem
                key={lesson.lesson_id}
                lesson={lesson}
                onClick={() => onLessonClick(lesson.lesson_id, module.module_id)}
                isActive={selectedLessonId === lesson.lesson_id}
                isUnlocked={isLessonUnlocked(lesson.lesson_id, module.module_id)}
                isComplete={isLessonComplete(lesson.lesson_id)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface LessonItemProps {
  lesson: Lesson;
  onClick: () => void;
  isActive: boolean;
  isUnlocked: boolean;
  isComplete: boolean;
}

function LessonItem({ lesson, onClick, isActive, isUnlocked, isComplete }: LessonItemProps) {
  let icon = null;
  if (!isUnlocked) {
    icon = <Lock className="mr-2 h-4 w-4 flex-shrink-0" />;
  } else if (isComplete) {
    icon = <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />;
  } else if (isActive) {
     icon = <PlayCircle className="mr-2 h-4 w-4 text-primary flex-shrink-0" />;
  } else {
    icon = <Unlock className="mr-2 h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
  }


  return (
    <li>
      <button
        onClick={onClick}
        disabled={!isUnlocked}
        className={`w-full text-left p-3 rounded-md font-body transition-all duration-200 ease-in-out flex items-center
                    ${isActive && isUnlocked
                      ? 'bg-primary text-primary-foreground font-semibold shadow-inner' 
                      : isUnlocked 
                        ? 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                        : 'text-muted-foreground cursor-not-allowed bg-muted/50'
                    }
                    ${isComplete && isUnlocked ? 'border-l-4 border-green-500' : ''}
                  `}
      >
        {icon}
        <span className="truncate">{lesson.lesson_title}</span>
      </button>
    </li>
  );
}


// --- Welcome Message ---
function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <GraduationCap className="w-24 h-24 text-primary mb-6" />
      <h2 className="text-4xl font-headline font-semibold mb-4 text-primary">Welcome to CoursePilot!</h2>
      <p className="text-xl text-muted-foreground font-body">
        Select a lesson from the sidebar to begin your learning journey.
      </p>
      <p className="mt-2 text-md text-muted-foreground font-body">
        Complete lessons to unlock new challenges and modules.
      </p>
    </div>
  );
}

// --- Task Specific Display Components ---

interface HtmlTaskDisplayProps {
  task: HtmlTask;
  onQuizAnswer: (question: QuizQuestion, studentAnswer: QuizAnswer) => void;
  onGenericSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
  markTaskAsSolved: () => void;
}

function HtmlTaskDisplay({ task, onQuizAnswer, onGenericSubmit, quizFeedback, isAILoading, clearQuizFeedback, markTaskAsSolved }: HtmlTaskDisplayProps) {
  const metadata = task.metadata;

  // Quiz or Blank with Options rendering
  if ((task.action === 'quiz' || (task.action === 'blank' && metadata.questions && metadata.questions.find(q => q.type === 'blank_options'))) && metadata.questions && metadata.questions.length > 0) {
    const currentQuizQuestion = metadata.questions[0]; 
    const originalQuestionText = currentQuizQuestion.text;
    
    const displayedQuestionText = (quizFeedback?.question === originalQuestionText && quizFeedback.rewrittenQuestion) 
                                   ? quizFeedback.rewrittenQuestion 
                                   : originalQuestionText;

    const handleOptionClick = (answer: QuizAnswer) => {
      onQuizAnswer(currentQuizQuestion, answer);
    };

    let precodeParts: string[] = [];
    if (task.action === 'blank' && currentQuizQuestion.type === 'blank_options' && typeof metadata.precode === 'string') {
        precodeParts = metadata.precode.split('{{}}');
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-headline font-semibold">{metadata.caption}</h3>
        {metadata.intro && <p className="font-body text-muted-foreground">{metadata.intro}</p>}
        {quizFeedback && quizFeedback.question === originalQuestionText && quizFeedback.rewrittenQuestion && (
          <Card className="bg-yellow-50 border-yellow-300 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-headline text-yellow-700 flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" /> Here's a Hint!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-600 mb-2 font-body">Your answer <code className="bg-yellow-100 p-1 rounded text-yellow-700">{quizFeedback.studentAnswer}</code> to "<span className="italic">{quizFeedback.question}</span>" was incorrect.</p>
              <p className="text-md font-body text-yellow-800">{quizFeedback.rewrittenQuestion}</p>
               <Button variant="ghost" size="sm" onClick={clearQuizFeedback} className="mt-2 text-yellow-700 hover:bg-yellow-100">
                <RotateCcw className="mr-1 h-3 w-3" /> Try Original Question Again
              </Button>
            </CardContent>
          </Card>
        )}

        {task.action === 'blank' && currentQuizQuestion.type === 'blank_options' && precodeParts.length > 0 ? (
            <div className="font-body text-lg">
                <span>{precodeParts[0]}</span>
                 <span className="inline-block mx-2 text-primary font-semibold">(Choose an option below)</span>
                <span>{precodeParts[1]}</span>
            </div>
        ) : (
            <p className="text-lg font-body">{displayedQuestionText}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentQuizQuestion.answers.map((answer, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="justify-start p-4 text-left h-auto whitespace-normal hover:bg-accent hover:text-accent-foreground transition-transform transform hover:scale-105"
              onClick={() => handleOptionClick(answer)}
              disabled={isAILoading}
            >
              {isAILoading && quizFeedback?.studentAnswer === answer.text && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {answer.text}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Fill-in-the-blank (free text) HTML rendering
  if (task.action === 'blank' && typeof metadata.precode === 'string' && typeof metadata.answer === 'string' && !metadata.questions) {
    const [textBefore, textAfter] = metadata.precode.split('{{}}');
    const correctAnswer = metadata.answer.match(/\{\{(.*?)\}\}/)?.[1] || '';
    const [userAnswer, setUserAnswer] = useState('');

    const handleSubmitBlank = () => {
      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
      // For free text blank, success/failed messages might not be in questions. Using metadata directly or generic.
      onGenericSubmit(isCorrect, metadata.hint || "Correct!", metadata.hint || "Try again.");
    };

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-headline font-semibold">{metadata.caption}</h3>
        {metadata.problem && <div className="prose prose-lg max-w-none font-body course-html-content" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}
        <div className="flex items-center space-x-2 mt-2 font-body text-lg">
          <span>{textBefore}</span>
          <input 
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="border border-input rounded-md px-2 py-1 w-32 bg-background text-foreground"
            aria-label="Fill in the blank"
          />
          <span>{textAfter}</span>
        </div>
        <Button onClick={handleSubmitBlank}>Submit Answer</Button>
      </div>
    );
  }
  
  // Lecture/Text HTML rendering
  return (
    <div>
      <h3 className="text-2xl font-headline font-semibold mb-3">{metadata.caption}</h3>
      {metadata.intro && <p className="font-body text-muted-foreground mb-2">{metadata.intro}</p>}
      {metadata.problem && <div className="prose prose-lg max-w-none font-body course-html-content" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}
      <style jsx global>{`
        .course-html-content h1 { @apply text-2xl font-headline font-semibold mb-4 mt-6 text-primary; }
        .course-html-content h2 { @apply text-xl font-headline font-semibold mb-3 mt-5; }
        .course-html-content p { @apply mb-3 leading-relaxed; }
        .course-html-content ul { @apply list-disc list-inside mb-3 pl-4; }
        .course-html-content li { @apply mb-1; }
        .course-html-content strong { @apply font-semibold; }
        .course-html-content code { @apply bg-muted text-muted-foreground px-1 py-0.5 rounded text-sm font-code; }
      `}</style>
    </div>
  );
}

interface AdsTaskDisplayProps {
  task: AdsTask;
}

function AdsTaskDisplay({ task }: AdsTaskDisplayProps) {
  const metadata = task.metadata;
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
      {metadata.intro && <p className="font-body text-lg">{metadata.intro}</p>}
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border shadow-inner">
        <img src={`https://placehold.co/600x400.png?text=${encodeURIComponent(metadata.caption)}`} alt={metadata.caption} className="w-full h-full object-cover rounded-lg" data-ai-hint="video player"/>
      </div>
      <p className="text-sm text-center text-muted-foreground font-body">Video content is a placeholder. Source: {metadata.video_source || 'N/A'}</p>
      {metadata.faqs && metadata.faqs.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-1">FAQs:</h4>
          <ul className="list-disc list-inside text-sm font-body">
            {metadata.faqs.map((faq, i) => <li key={i}>{faq}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

interface CodeTaskDisplayProps {
  task: CodeTask;
  onGenericSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string) => void;
  markTaskAsSolved: () => void; 
}

function CodeTaskDisplay({ task, onGenericSubmit, markTaskAsSolved }: CodeTaskDisplayProps) {
  const metadata = task.metadata;
  const lang = metadata.code_language || metadata.language || 'text';
  
  const initialCode = typeof metadata.precode === 'object' ? (metadata.precode?.[lang] || '') : (typeof metadata.precode === 'string' ? metadata.precode : '');
  const [userCode, setUserCode] = useState(initialCode);
  
  const [userBlankAnswer, setUserBlankAnswer] = useState('');

  useEffect(() => { 
    const newInitialCode = typeof metadata.precode === 'object' ? (metadata.precode?.[lang] || '') : (typeof metadata.precode === 'string' ? metadata.precode : '');
    setUserCode(newInitialCode);
    setUserBlankAnswer(''); 
  }, [task, lang, metadata.precode]);


  const handleCodeSubmit = () => {
    if (task.action === 'code' && metadata.answer && metadata.answer.length > 0) {
      const expectedAnswerObj = metadata.answer.find(ans => ans[lang] !== undefined);
      const expectedCode = expectedAnswerObj ? expectedAnswerObj[lang] : undefined;

      if (expectedCode) {
        const isCorrect = userCode.trim() === expectedCode.trim();
        onGenericSubmit(isCorrect, "Code Submitted Correctly!", "Code is not quite right. Check your logic.");
      } else {
        onGenericSubmit(true, "Code Submitted!", "Could not verify code for this language.", false); 
        markTaskAsSolved(); 
      }
    } else {
      onGenericSubmit(true, "Code Processed", "No specific check for this task.", false);
      markTaskAsSolved(); 
    }
  };

  if (task.action === 'code_blank' && metadata.precode && typeof metadata.precode === 'object' && metadata.precode[lang] && metadata.solution) {
    const precodeContent = metadata.precode[lang] as string; // Assert as string based on previous check
    const precodeParts = precodeContent.split(/\{\{|\}\}/g); 
    const solutionsForLang = metadata.solution?.[lang];
    let blankInputRendered = false; 

    const handleSubmitCodeBlank = () => {
        if (solutionsForLang && solutionsForLang["0"] && solutionsForLang["0"].includes(userBlankAnswer.trim())) {
            onGenericSubmit(true, "Correct!", "Try again!");
        } else {
            onGenericSubmit(false, "Correct!", "Try again!");
        }
    };
    
    return (
      <div className="space-y-3">
        <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
        {metadata.intro && <p className="font-body text-muted-foreground mb-2">{metadata.intro}</p>}
        {metadata.problem && <div className="font-body text-lg prose prose-lg max-w-none course-html-content" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}
        <div className="bg-gray-900 text-gray-100 p-4 rounded-md shadow-md font-code">
          {precodeParts.map((part, idx) => {
            if (idx % 2 === 0) { 
              return <span key={idx} dangerouslySetInnerHTML={{__html: part}} />;
            } else { 
              if (!blankInputRendered) { 
                blankInputRendered = true;
                return (
                  <input
                    key={idx}
                    type="text"
                    value={userBlankAnswer}
                    onChange={(e) => setUserBlankAnswer(e.target.value)}
                    className="bg-gray-700 text-gray-100 border border-gray-600 rounded mx-1 px-1 py-0.5 w-32"
                    aria-label={`Fill in blank for ${part}`}
                  />
                );
              }
              return <span key={idx} className="text-yellow-400"> ({"{{...}}"}) </span>;
            }
          })}
        </div>
        <Button onClick={handleSubmitCodeBlank}>Submit Code Answer</Button>
        {metadata.hint && <p className="text-sm italic text-muted-foreground">Hint: {metadata.hint}</p>}
         <style jsx global>{`
            .course-html-content h1 { @apply text-2xl font-headline font-semibold mb-4 mt-6 text-primary; }
            .course-html-content h2 { @apply text-xl font-headline font-semibold mb-3 mt-5; }
            .course-html-content p { @apply mb-3 leading-relaxed; }
            .course-html-content ul { @apply list-disc list-inside mb-3 pl-4; }
            .course-html-content li { @apply mb-1; }
            .course-html-content strong { @apply font-semibold; }
            .course-html-content code { @apply bg-muted text-muted-foreground px-1 py-0.5 rounded text-sm font-code; }
          `}</style>
      </div>
    );
  }

  // Default code task display (action: 'code')
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
       {metadata.intro && <p className="font-body text-muted-foreground mb-2">{metadata.intro}</p>}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <CodeIcon className="w-4 h-4"/> 
        <span>Language: {lang}</span>
      </div>
      {metadata.problem && <div className="font-body text-lg prose prose-lg max-w-none course-html-content" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}
      
      <Textarea
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
        placeholder={`Enter your ${lang} code here...`}
        className="font-code bg-gray-900 text-gray-100 h-48 min-h-[120px] rounded-md shadow-inner border-gray-700 focus:border-primary"
        aria-label={`Code input for ${metadata.caption}`}
      />
      <Button onClick={handleCodeSubmit}>Submit Code</Button>
      {metadata.hint && <p className="text-sm italic text-muted-foreground">Hint: {metadata.hint}</p>}
       {metadata.events && metadata.drawing && (
        <div>
          <h4 className="font-semibold mt-2">Drawing Area &amp; Events:</h4>
          <div className="border border-dashed border-input p-4 mt-1 rounded-md min-h-[200px] bg-muted/50 flex items-center justify-center">
             <img src="https://placehold.co/300x200.png?text=Drawing+Canvas" alt="Drawing canvas placeholder" data-ai-hint="drawing canvas" />
          </div>
          <ul className="list-disc list-inside text-sm mt-1">
            {metadata.events.map(event => <li key={event.key}>{event.caption} (key: {event.key})</li>)}
          </ul>
        </div>
      )}
       <style jsx global>{`
        .course-html-content h1 { @apply text-2xl font-headline font-semibold mb-4 mt-6 text-primary; }
        .course-html-content h2 { @apply text-xl font-headline font-semibold mb-3 mt-5; }
        .course-html-content p { @apply mb-3 leading-relaxed; }
        .course-html-content ul { @apply list-disc list-inside mb-3 pl-4; }
        .course-html-content li { @apply mb-1; }
        .course-html-content strong { @apply font-semibold; }
        .course-html-content code { @apply bg-muted text-muted-foreground px-1 py-0.5 rounded text-sm font-code; }
      `}</style>
    </div>
  );
}

// --- Task Viewer Component ---
interface TaskViewerProps {
  task: Task;
  lessonId: number;
  taskIndex: number;
  onQuizAnswer: (question: QuizQuestion, studentAnswer: QuizAnswer) => void;
  onGenericSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
  markTaskAsSolved: () => void;
}

function TaskViewer({ task, lessonId, taskIndex, onQuizAnswer, onGenericSubmit, quizFeedback, isAILoading, clearQuizFeedback, markTaskAsSolved }: TaskViewerProps) {
  const getTaskIcon = (taskType: string, action?: string) => {
    if (taskType === 'html' && (action === 'lecture' || action === 'text')) return <BookOpen className="w-5 h-5 mr-2 text-primary" />;
    if (taskType === 'html') return <MonitorPlay className="w-5 h-5 mr-2 text-primary" />; // For quiz, blank
    if (taskType === 'ads') return <Film className="w-5 h-5 mr-2 text-primary" />;
    if (taskType === 'code') return <Terminal className="w-5 h-5 mr-2 text-primary" />;
    return <BookOpen className="w-5 h-5 mr-2 text-primary" />; // Default
  };
  
  const getTaskTypeLabel = (taskType: string, action?: string) => {
    if (taskType === 'html' && action === 'lecture') return 'Lecture';
    if (taskType === 'html' && action === 'text') return 'Reading';
    if (taskType === 'html' && action === 'quiz') return 'Quiz';
    if (taskType === 'html' && action === 'blank') return 'Fill in the Blank';
    if (taskType === 'ads') return 'Video';
    if (taskType === 'code' && action === 'code_blank') return 'Code Blank';
    if (taskType === 'code') return 'Coding Challenge';
    return taskType.replace('_', ' ');
  };

  const renderTaskContent = () => {
    switch (task.task_type) {
      case 'html':
        return <HtmlTaskDisplay 
                  task={task} 
                  onQuizAnswer={onQuizAnswer}
                  onGenericSubmit={onGenericSubmit}
                  quizFeedback={quizFeedback}
                  isAILoading={isAILoading}
                  clearQuizFeedback={clearQuizFeedback}
                  markTaskAsSolved={markTaskAsSolved}
                />;
      case 'ads':
        return <AdsTaskDisplay task={task} />;
      case 'code':
        return <CodeTaskDisplay task={task} onGenericSubmit={onGenericSubmit} markTaskAsSolved={markTaskAsSolved} />;
      default:
        const exhaustiveCheck: never = task; 
        return <p className="font-body">Unsupported task type: {(exhaustiveCheck as any)?.task_type}</p>;
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
            <div>
                {task.metadata.tag && task.metadata.tag.length > 0 && (
                <div className="flex space-x-2 mb-2">
                    {task.metadata.tag.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  {getTaskIcon(task.task_type, task.action)} 
                  <span className="font-semibold mr-2 capitalize">{getTaskTypeLabel(task.task_type, task.action)}</span>
                </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
                <Star className="w-4 h-4 mr-1 text-yellow-400" /> Difficulty: {task.metadata.difficulty}
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {renderTaskContent()}
      </CardContent>
    </Card>
  );
}

export default function CoursePilotPage() {
  return <CoursePilotApp />;
}

