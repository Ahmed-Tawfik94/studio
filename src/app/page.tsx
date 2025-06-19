
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronDown, ChevronRight, BookOpen, PlayCircle, Code2 as CodeIcon, MonitorPlay, Film, Terminal,
  ArrowLeft, ArrowRight, Lightbulb, Loader2, AlertCircle, RotateCcw, GraduationCap, Star, CheckCircle2, XCircle
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
  type: 'option' | 'blank' | 'blank_options' | string;
  answers: QuizAnswer[];
  answer: string; // For 'option'/'blank_options', this is stringified 'value'. For 'blank' (free text), it's the text.
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
}

interface HtmlTaskMetadata extends BaseTaskMetadata {
  questions?: QuizQuestion[];
  multi_choice?: boolean;
  // For action: 'blank' (free text or with options)
  precode?: string; // Sentence with {{}} for free text blank, or template with placeholder for options
  answer?: string; // Correct text for free text blank: "text {{correct_word}}". Not used if 'questions' provides options.
  // For action: 'blank' with options, structure is within 'questions'
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
  precode: { [key: string]: string };
  code_language?: string;
  language?: string;
  answer?: Array<{ [key: string]: string }>; // e.g. [{ "py": "print('hello')" }] for verifiable code
  solution?: { [key: string]: { [key: string]: string[] } }; // For code_blank solutions
  auto_verify?: boolean;
  verification_type?: string;
  drawing?: boolean;
  publish_web?: boolean;
  events?: CodeEvent[];
}

interface BaseTypedTask<TType extends string, TMetadata extends BaseTaskMetadata> {
  task_type: TType;
  action?: 'lecture' | 'quiz' | 'text' | 'blank' | 'code_blank' | 'code'; // Added 'code'
  metadata: TMetadata;
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
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ question: string; studentAnswer: string; rewrittenQuestion: string | null } | null>(null);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [taskCompletionStatus, setTaskCompletionStatus] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const selectedLesson = useMemo(() => {
    if (!selectedLessonId) return null;
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(l => l.lesson_id === selectedLessonId);
      if (lesson) return lesson;
    }
    return null;
  }, [selectedLessonId]);

  const currentTask = useMemo(() => {
    return selectedLesson?.tasks[selectedTaskIndex] || null;
  }, [selectedLesson, selectedTaskIndex]);

  const currentTaskId = useMemo(() => {
    if (selectedLessonId === null || !currentTask) return '';
    return getTaskId(selectedLessonId, selectedTaskIndex);
  }, [selectedLessonId, currentTask, selectedTaskIndex]);

  const isCurrentTaskSolved = useMemo(() => {
    if (!currentTask) return false;
    // Tasks like 'lecture' or 'ads' are considered solved on view
    if (currentTask.task_type === 'ads' || (currentTask.task_type === 'html' && (currentTask.action === 'lecture' || currentTask.action === 'text'))) {
        return true;
    }
    return !!taskCompletionStatus[currentTaskId];
  }, [taskCompletionStatus, currentTaskId, currentTask]);
  
  const markTaskAsSolved = useCallback(() => {
    if (currentTaskId) {
      setTaskCompletionStatus(prev => ({ ...prev, [currentTaskId]: true }));
    }
  }, [currentTaskId]);


  useEffect(() => {
    // Automatically mark lecture/ads tasks as solved when they become current
    if (currentTask && (currentTask.task_type === 'ads' || (currentTask.task_type === 'html' && (currentTask.action === 'lecture' || currentTask.action === 'text')))) {
      if (currentTaskId && !taskCompletionStatus[currentTaskId]) {
        markTaskAsSolved();
      }
    }
  }, [currentTask, currentTaskId, markTaskAsSolved, taskCompletionStatus]);


  const handleLessonClick = (lessonId: number, moduleId: number) => {
    setSelectedLessonId(lessonId);
    setSelectedModuleId(moduleId);
    setSelectedTaskIndex(0);
    setQuizFeedback(null);
  };

  const handleNextTask = () => {
    if (selectedLesson && selectedTaskIndex < selectedLesson.tasks.length - 1) {
      if (isCurrentTaskSolved) {
        setSelectedTaskIndex(prev => prev + 1);
        setQuizFeedback(null);
      } else {
        toast({
          title: "Task Not Completed",
          description: "Please complete the current task before moving to the next one.",
          variant: "destructive",
        });
      }
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
      markTaskAsSolved();
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
      if(solveTask) markTaskAsSolved();
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

  return (
    <div className="flex h-screen bg-background text-foreground">
      <CourseSidebar
        courseName={courseData.course_name}
        modules={courseData.modules}
        selectedLessonId={selectedLessonId}
        selectedModuleId={selectedModuleId}
        onLessonClick={handleLessonClick}
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
        markTaskAsSolved={markTaskAsSolved} // Pass this down
        isCurrentTaskSolved={isCurrentTaskSolved}
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
}

function CourseSidebar({ courseName, modules, selectedLessonId, selectedModuleId, onLessonClick }: CourseSidebarProps) {
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
            onLessonClick={(lessonId) => onLessonClick(lessonId, module.module_id)}
            isActiveModule={selectedModuleId === module.module_id}
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
        disabled={isLastTask || !isCurrentTaskSolved}
        variant="outline"
        className="hover:bg-accent hover:text-accent-foreground"
        title={!isCurrentTaskSolved && !isLastTask ? "Complete current task to proceed" : undefined}
      >
        Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}


// --- Sidebar Components (ModuleAccordion, LessonItem) ---
interface ModuleAccordionProps {
  module: Module;
  selectedLessonId: number | null;
  onLessonClick: (lessonId: number) => void;
  isActiveModule: boolean;
}

function ModuleAccordion({ module, selectedLessonId, onLessonClick, isActiveModule }: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(isActiveModule);

  useEffect(() => {
    setIsOpen(isActiveModule);
  }, [isActiveModule]);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="rounded-md border border-border shadow-sm transition-all duration-300 ease-in-out">
      <button
        onClick={toggleOpen}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-4 text-left font-headline font-medium text-lg hover:bg-accent transition-colors duration-200 rounded-t-md"
        aria-controls={`module-${module.module_id}-content`}
      >
        <span>{module.module_title}</span>
        {isOpen ? <ChevronDown className="h-5 w-5 text-primary" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
      </button>
      <div
        id={`module-${module.module_id}-content`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
      >
        <ul className="p-2 space-y-1 bg-background rounded-b-md">
          {module.lessons.map(lesson => (
            <LessonItem
              key={lesson.lesson_id}
              lesson={lesson}
              onClick={() => onLessonClick(lesson.lesson_id)}
              isActive={selectedLessonId === lesson.lesson_id}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

interface LessonItemProps {
  lesson: Lesson;
  onClick: () => void;
  isActive: boolean;
}

function LessonItem({ lesson, onClick, isActive }: LessonItemProps) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-md font-body transition-all duration-200 ease-in-out
                    ${isActive 
                      ? 'bg-primary text-primary-foreground font-semibold shadow-inner' 
                      : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                    }`}
      >
        {lesson.lesson_title}
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
        Navigate through modules and lessons to explore AI-powered programming.
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
    const currentQuizQuestion = metadata.questions[0]; // Assuming one question per task for quiz/blank_options
    const originalQuestionText = currentQuizQuestion.text;
    
    const displayedQuestionText = (quizFeedback?.question === originalQuestionText && quizFeedback.rewrittenQuestion) 
                                   ? quizFeedback.rewrittenQuestion 
                                   : originalQuestionText;

    const handleOptionClick = (answer: QuizAnswer) => {
      onQuizAnswer(currentQuizQuestion, answer); // Reuses onQuizAnswer for blank_options
    };

    // For 'blank_options', we might need to render the precode with a placeholder for options
    let precodeParts: string[] = [];
    if (task.action === 'blank' && currentQuizQuestion.type === 'blank_options' && metadata.precode) {
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
  if (task.action === 'blank' && metadata.precode && metadata.answer && !metadata.questions) {
    const [textBefore, textAfter] = metadata.precode.split('{{}}');
    const correctAnswer = metadata.answer.match(/\{\{(.*?)\}\}/)?.[1] || '';
    const [userAnswer, setUserAnswer] = useState('');

    const handleSubmitBlank = () => {
      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
      onGenericSubmit(isCorrect, metadata.questions?.[0]?.success, metadata.questions?.[0]?.failed);
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
        <PlayCircle className="w-16 h-16 text-muted-foreground" />
        <span className="sr-only">Video placeholder for {metadata.video}</span>
      </div>
      <p data-ai-hint="video player" className="text-sm text-center text-muted-foreground font-body">Video content is a placeholder. Source: {metadata.video_source || 'N/A'}</p>
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
  const [userCode, setUserCode] = useState(metadata.precode?.[lang] || '');
  
  // For code_blank
  const [userBlankAnswer, setUserBlankAnswer] = useState('');


  const handleCodeSubmit = () => {
    if (task.action === 'code' && metadata.answer && metadata.answer.length > 0) {
      const expectedCode = metadata.answer[0]?.[lang];
      if (expectedCode) {
        const isCorrect = userCode.trim() === expectedCode.trim();
        onGenericSubmit(isCorrect, "Code Submitted Correctly!", "Code is not quite right. Check your logic.");
        // markTaskAsSolved is handled by onGenericSubmit if correct
      } else {
        // No specific answer to check against, consider it "submitted"
        onGenericSubmit(true, "Code Submitted!", "Could not verify code.", false); // Don't mark as solved if not verifiable
        markTaskAsSolved(); // Or decide if this type of task auto-solves
      }
    } else {
      // For tasks without a verifiable answer (e.g. drawing, general coding without solution)
      onGenericSubmit(true, "Code Processed", "No specific check for this task.", false);
      markTaskAsSolved(); // Mark as solved on any submission if not verifiable
    }
  };

  if (task.action === 'code_blank' && metadata.precode && metadata.precode[lang] && metadata.solution) {
    const precodeParts = metadata.precode[lang].split(/\{\{|\}\}/g);
    const solutionsForLang = metadata.solution?.[lang];
    let blankIndex = 0;

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
        {metadata.problem && <p className="font-body text-lg" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}
        <div className="bg-gray-900 text-gray-100 p-4 rounded-md shadow-md font-code">
          {precodeParts.map((part, idx) => {
            if (idx % 2 === 0) {
              return <span key={idx}>{part}</span>;
            } else {
              const currentBlankIndex = blankIndex++;
              if (currentBlankIndex === 0) { // Simple: only one blank input
                return (
                  <input
                    key={idx}
                    type="text"
                    value={userBlankAnswer}
                    onChange={(e) => setUserBlankAnswer(e.target.value)}
                    className="bg-gray-700 text-gray-100 border border-gray-600 rounded mx-1 px-1 py-0.5 w-24"
                    aria-label={`Fill in blank ${currentBlankIndex + 1}`}
                  />
                );
              }
              return <span key={idx} className="text-yellow-400">(blank {currentBlankIndex +1})</span>;
            }
          })}
        </div>
        <Button onClick={handleSubmitCodeBlank}>Submit Code Answer</Button>
        {metadata.hint && <p className="text-sm italic text-muted-foreground">Hint: {metadata.hint}</p>}
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
      {metadata.problem && <p className="font-body text-lg" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}
      
      <Textarea
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
        placeholder={`Enter your ${lang} code here...`}
        className="font-code bg-gray-900 text-gray-100 h-48 min-h-[120px] rounded-md shadow-inner border-gray-700 focus:border-primary"
      />
      <Button onClick={handleCodeSubmit}>Submit Code</Button>
      {metadata.hint && <p className="text-sm italic text-muted-foreground">Hint: {metadata.hint}</p>}
       {metadata.events && metadata.drawing && (
        <div>
          <h4 className="font-semibold mt-2">Drawing Area &amp; Events:</h4>
          <div className="border border-dashed border-input p-4 mt-1 rounded-md min-h-[200px] bg-muted/50 flex items-center justify-center">
            <p data-ai-hint="drawing canvas" className="text-muted-foreground">Drawing Canvas Placeholder</p>
          </div>
          <ul className="list-disc list-inside text-sm mt-1">
            {metadata.events.map(event => <li key={event.key}>{event.caption} (key: {event.key})</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Task Viewer Component ---
interface TaskViewerProps {
  task: Task;
  onQuizAnswer: (question: QuizQuestion, studentAnswer: QuizAnswer) => void;
  onGenericSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
  markTaskAsSolved: () => void;
}

function TaskViewer({ task, onQuizAnswer, onGenericSubmit, quizFeedback, isAILoading, clearQuizFeedback, markTaskAsSolved }: TaskViewerProps) {
  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'html': return <MonitorPlay className="w-5 h-5 mr-2 text-primary" />;
      case 'ads': return <Film className="w-5 h-5 mr-2 text-primary" />;
      case 'code': return <Terminal className="w-5 h-5 mr-2 text-primary" />;
      default: return <BookOpen className="w-5 h-5 mr-2 text-primary" />;
    }
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
        // ADS tasks are auto-solved when viewed (handled in CoursePilotApp useEffect)
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
                  {getTaskIcon(task.task_type)} 
                  <span className="font-semibold mr-2 capitalize">{task.task_type.replace('_', ' ')} Task</span>
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

