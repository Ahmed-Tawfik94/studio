
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronDown, ChevronRight, BookOpen, PlayCircle, Code2 as CodeIcon,
  ArrowLeft, ArrowRight, Lightbulb, Loader2, AlertCircle, RotateCcw, GraduationCap, Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { rewriteQuizQuestion, RewriteQuizQuestionInput } from '@/ai/flows/rewrite-quiz-question';
import courseDataFromFile from '@/data/courseData'; // Renamed import

// --- Type Definitions based on courseData.js ---

interface QuizAnswer {
  text: string;
  value: number; // Value of the answer, used to check against QuizQuestion.answer
}

interface QuizQuestion {
  text: string;
  type: 'option' | 'blank' | string; // 'option' for multiple choice, 'blank' for fill-in-the-blank
  answers: QuizAnswer[];
  answer: string; // For 'option', this is the stringified 'value' of the correct answer. For 'blank', it's the expected text.
  hint?: string;
  success?: string;
  failed?: string;
  // multi_choice is part of metadata in courseData, not directly in question
}

interface BaseTaskMetadata {
  caption: string;
  difficulty: number;
  hint?: string;
  hints?: Array<{ cost?: number; text: string }>;
  tag?: string[];
  faqs?: string[];
  intro?: string; // Common enough to be here
  problem?: string; // Common enough to be here
}

interface HtmlTaskMetadata extends BaseTaskMetadata {
  // 'problem' is already in BaseTaskMetadata for lecture/text
  questions?: QuizQuestion[];
  multi_choice?: boolean; // Specific to quiz action
  // For action: 'blank'
  precode?: string; // The string with {{}} for the blank
  answer?: string; // The string with {{correct_answer}}
}

interface AdsTaskMetadata extends BaseTaskMetadata {
  // 'intro' is already in BaseTaskMetadata
  video: string; // path or URL
  video_source?: string;
}

interface CodeEvent {
  caption: string;
  key: string;
}
interface CodeTaskMetadata extends BaseTaskMetadata {
  // 'problem' is already in BaseTaskMetadata
  precode: { [key: string]: string }; // e.g., {"python": "print('hello')"} or {"py": "code with {{}}"} for code_blank
  code_language?: string; // For regular code tasks
  language?: string; // Sometimes used, esp. for action: 'code_blank'
  answer?: Array<{ [key: string]: string }>; // For verifiable code answers
  solution?: { [key: string]: { [key: string]: string[] } }; // For code_blank solutions
  auto_verify?: boolean;
  verification_type?: string;
  drawing?: boolean;
  publish_web?: boolean;
  events?: CodeEvent[];
}

// Discriminated union for Task types
interface BaseTypedTask<TType extends string, TMetadata extends BaseTaskMetadata> {
  task_type: TType;
  action?: 'lecture' | 'quiz' | 'text' | 'blank' | 'code_blank'; // Added 'blank' and 'code_blank'
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


// --- Main App Component ---
function CoursePilotApp() {
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ question: string; studentAnswer: string; rewrittenQuestion: string | null } | null>(null);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
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

  const handleLessonClick = (lessonId: number, moduleId: number) => {
    setSelectedLessonId(lessonId);
    setSelectedModuleId(moduleId);
    setSelectedTaskIndex(0);
    setQuizFeedback(null);
  };

  const handleNextTask = () => {
    if (selectedLesson && selectedTaskIndex < selectedLesson.tasks.length - 1) {
      setSelectedTaskIndex(prev => prev + 1);
      setQuizFeedback(null);
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
    // For 'option' type, compare studentAnswer.value with question.answer (which is string value)
    // For 'blank' type, this function might need adjustment or a different handler for correctness.
    // Assuming 'correct' is determined by comparing studentAnswer.value.toString() to question.answer for 'option' type.
    const isCorrect = question.type === 'option' && studentAnswer.value.toString() === question.answer;

    if (isCorrect) {
      setQuizFeedback(null);
      toast({
        title: question.success || "Correct!",
        description: "Great job!",
        variant: "default",
      });
    } else {
      if (!selectedLesson || !currentTask) return;
      setIsAILoading(true);
      setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: "Thinking of a hint..." });
      try {
        const lessonContentForAI = selectedLesson.aim + "\n" + (selectedLesson.description || "") + "\n" +
          selectedLesson.tasks.map(t => {
            if (t.metadata.problem) return t.metadata.problem;
            if (t.metadata.intro) return t.metadata.intro;
            return t.metadata.caption;
          }).join("\n\n");

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
        });
      } catch (error) {
        console.error("AI Error:", error);
        toast({
          title: "Error getting hint",
          description: "Could not generate a hint at this time.",
          variant: "destructive",
        });
        setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: "Could not load hint." });
      } finally {
        setIsAILoading(false);
      }
    }
  };
  
  const handleBlankSubmit = (isCorrect: boolean, successMsg?: string, failedMsg?: string) => {
    if (isCorrect) {
      toast({
        title: successMsg || "Correct!",
        description: "Well done!",
      });
    } else {
      toast({
        title: failedMsg || "Not quite!",
        description: "Try that again.",
        variant: "destructive",
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
        onBlankSubmit={handleBlankSubmit}
        quizFeedback={quizFeedback}
        isAILoading={isAILoading}
        clearQuizFeedback={() => setQuizFeedback(null)}
        onNextTask={handleNextTask}
        onPrevTask={handlePrevTask}
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
  onBlankSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
  onNextTask: () => void;
  onPrevTask: () => void;
}

function MainContentArea({
  selectedLesson, currentTask, selectedTaskIndex, 
  onQuizAnswer, onBlankSubmit, quizFeedback, isAILoading, clearQuizFeedback,
  onNextTask, onPrevTask
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
          onBlankSubmit={onBlankSubmit}
          quizFeedback={quizFeedback}
          isAILoading={isAILoading}
          clearQuizFeedback={clearQuizFeedback}
        />
        <TaskNavigationControls
          onPrevTask={onPrevTask}
          onNextTask={onNextTask}
          selectedTaskIndex={selectedTaskIndex}
          totalTasks={selectedLesson.tasks.length}
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
}

function TaskNavigationControls({ onPrevTask, onNextTask, selectedTaskIndex, totalTasks }: TaskNavigationControlsProps) {
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
        disabled={selectedTaskIndex === totalTasks - 1}
        variant="outline"
        className="hover:bg-accent hover:text-accent-foreground"
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
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`} // Increased max-h for more lessons
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
  onBlankSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
}

function HtmlTaskDisplay({ task, onQuizAnswer, onBlankSubmit, quizFeedback, isAILoading, clearQuizFeedback }: HtmlTaskDisplayProps) {
  const metadata = task.metadata;

  // Quiz rendering
  if (task.action === 'quiz' && metadata.questions && metadata.questions.length > 0) {
    const currentQuizQuestion = metadata.questions[0]; // Assuming one question per quiz task
    const originalQuestionText = currentQuizQuestion.text;
    
    const displayedQuestionText = (quizFeedback?.question === originalQuestionText && quizFeedback.rewrittenQuestion) 
                                   ? quizFeedback.rewrittenQuestion 
                                   : originalQuestionText;

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
        <p className="text-lg font-body">{displayedQuestionText}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentQuizQuestion.answers.map((answer, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="justify-start p-4 text-left h-auto whitespace-normal hover:bg-accent hover:text-accent-foreground transition-transform transform hover:scale-105"
              onClick={() => onQuizAnswer(currentQuizQuestion, answer)}
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

  // Fill-in-the-blank HTML rendering
  if (task.action === 'blank' && metadata.precode && metadata.answer) {
    const [textBefore, textAfter] = metadata.precode.split('{{}}');
    const correctAnswer = metadata.answer.match(/\{\{(.*?)\}\}/)?.[1] || '';
    const [userAnswer, setUserAnswer] = useState('');

    const handleSubmitBlank = () => {
      onBlankSubmit(userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase(), "Correct!", "Not quite, try again!");
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
  onBlankSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string) => void; // For code_blank
}

function CodeTaskDisplay({ task, onBlankSubmit }: CodeTaskDisplayProps) {
  const metadata = task.metadata;
  const lang = metadata.code_language || metadata.language || 'text';
  const [userCodeAnswer, setUserCodeAnswer] = useState('');


  if (task.action === 'code_blank' && metadata.precode && metadata.precode[lang] && metadata.solution) {
    const precodeParts = metadata.precode[lang].split(/\{\{|\}\}/g);
    const solutionsForLang = metadata.solution?.[lang];
    let blankIndex = 0;

    const handleSubmitCodeBlank = () => {
        // Basic check: see if user's answer is one of the solutions for the first blank
        // This needs to be more robust for multiple blanks
        if (solutionsForLang && solutionsForLang["0"] && solutionsForLang["0"].includes(userCodeAnswer.trim())) {
            onBlankSubmit(true, "Correct!", "Try again!");
        } else {
            onBlankSubmit(false, "Correct!", "Try again!");
        }
    };
    
    return (
      <div className="space-y-3">
        <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
        {metadata.problem && <p className="font-body text-lg" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}
        <div className="bg-gray-900 text-gray-100 p-4 rounded-md shadow-md font-code">
          {precodeParts.map((part, idx) => {
            if (idx % 2 === 0) {
              return <span key={idx}>{part}</span>;
            } else {
              const currentBlankIndex = blankIndex++;
              // For simplicity, this example only handles one blank input.
              // A more complex setup would be needed for multiple {{}} blanks.
              if (currentBlankIndex === 0) {
                return (
                  <input
                    key={idx}
                    type="text"
                    value={userCodeAnswer}
                    onChange={(e) => setUserCodeAnswer(e.target.value)}
                    className="bg-gray-700 text-gray-100 border border-gray-600 rounded mx-1 px-1 py-0.5 w-24"
                    aria-label={`Fill in blank ${currentBlankIndex + 1}`}
                  />
                );
              }
              return <span key={idx} className="text-yellow-400">(blank {currentBlankIndex +1})</span>; // Placeholder for subsequent blanks
            }
          })}
        </div>
        <Button onClick={handleSubmitCodeBlank}>Submit Code Answer</Button>
        {metadata.hint && <p className="text-sm italic text-muted-foreground">Hint: {metadata.hint}</p>}
      </div>
    );
  }

  // Default code task display
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <CodeIcon className="w-4 h-4"/> 
        <span>Language: {lang}</span>
      </div>
      {metadata.problem && <p className="font-body text-lg" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}
      {metadata.precode && metadata.precode[lang] && (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-md shadow-md overflow-x-auto">
          <pre><code className={`language-${lang} font-code`}>{metadata.precode[lang]}</code></pre>
        </div>
      )}
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
  onBlankSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
}

function TaskViewer({ task, onQuizAnswer, onBlankSubmit, quizFeedback, isAILoading, clearQuizFeedback }: TaskViewerProps) {
  const renderTaskContent = () => {
    switch (task.task_type) {
      case 'html':
        return <HtmlTaskDisplay 
                  task={task} 
                  onQuizAnswer={onQuizAnswer}
                  onBlankSubmit={onBlankSubmit}
                  quizFeedback={quizFeedback}
                  isAILoading={isAILoading}
                  clearQuizFeedback={clearQuizFeedback}
                />;
      case 'ads':
        return <AdsTaskDisplay task={task} />;
      case 'code':
        return <CodeTaskDisplay task={task} onBlankSubmit={onBlankSubmit} />;
      default:
        const exhaustiveCheck: never = task; 
        return <p className="font-body">Unsupported task type: {exhaustiveCheck['task_type']}</p>;
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-2">
        {task.metadata.tag && task.metadata.tag.length > 0 && (
          <div className="flex space-x-2 mb-2">
            {task.metadata.tag.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
        )}
         <div className="flex items-center text-sm text-muted-foreground">
          <Star className="w-4 h-4 mr-1 text-yellow-400" /> Difficulty: {task.metadata.difficulty}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        {renderTaskContent()}
      </CardContent>
    </Card>
  );
}

export default function CoursePilotPage() {
  return <CoursePilotApp />;
}
