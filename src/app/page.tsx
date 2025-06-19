//
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronDown, ChevronRight, BookOpen, HelpCircle, PlayCircle, Code2 as CodeIcon,
  ArrowLeft, ArrowRight, Lightbulb, Loader2, AlertCircle, RotateCcw, XCircle, CheckCircle, GraduationCap, Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { rewriteQuizQuestion, RewriteQuizQuestionInput } from '@/ai/flows/rewrite-quiz-question';

// --- Enhanced Type Definitions based on Schema ---

interface QuizAnswer {
  text: string;
  correct?: boolean; // Maintained for compatibility with existing logic
  value?: number; // From schema
}

interface QuizQuestion {
  text: string;
  type: string; // From schema (e.g., 'single-choice', 'multiple-choice')
  answers: QuizAnswer[];
  answer?: string; // Correct answer key/text (from schema, optional for now)
  hint?: string; // (from schema, optional)
  success?: string; // (from schema, optional)
  failed?: string; // (from schema, optional)
}

interface BaseTaskMetadata {
  caption: string;
  difficulty: number; // Required by schema
  hint?: string;
  hints?: Array<{ cost?: number; text: string }>;
  tag?: string[];
  faqs?: string[];
}

interface HtmlTaskMetadata extends BaseTaskMetadata {
  problem: string; // HTML content for lecture/text. For quiz, could be intro/context.
  // For action === 'quiz'
  questions?: QuizQuestion[];
  multi_choice?: boolean;
}

interface AdsTaskMetadata extends BaseTaskMetadata {
  intro: string;
  video: string; // path or URL
  video_source?: string;
}

interface CodeTaskMetadata extends BaseTaskMetadata {
  problem: string;
  precode: { [key: string]: string };
  code_language: string; // Moved here from Task root for specificity
  answer?: Array<{ [key: string]: string }>;
  solution?: { [key: string]: { [key: string]: string[] } };
  auto_verify?: boolean;
  verification_type?: string;
  drawing?: boolean;
  publish_web?: boolean;
}

// Discriminated union for Task types
interface BaseTypedTask<TType extends string, TMetadata extends BaseTaskMetadata> {
  task_type: TType;
  action?: 'lecture' | 'quiz' | 'text'; // Primarily for 'html'
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
  tasks: Task[];
}

interface Module {
  module_id: number;
  module_title: string;
  lessons: Lesson[];
}

interface Course {
  course_name: string;
  modules: Module[];
}

const courseData: Course = {
  "course_name": "AI-Powered Programming for Young Innovators",
  "modules": [
    {
      "module_id": 1,
      "module_title": "What in the World is AI? (And Why Should I Care?)",
      "lessons": [
        {
          "lesson_id": 1.1,
          "lesson_title": "Meet AI! Your Digital Super-Helper",
          "aim": "To understand what Artificial Intelligence is and see examples in everyday life.",
          "tasks": [
            {"task_type": "html", "action": "lecture", "metadata": {"caption": "What is AI?", "difficulty": 1, "problem": "<h1>What is AI?</h1><p>Artificial Intelligence (AI) is the science of making computers do things that normally require human intelligence.</p><p>Think about your favorite video game characters that seem to think for themselves, or how your phone can understand your voice commands. That's AI in action!</p>"}},
            {"task_type": "ads", "metadata": {"caption": "AI in Your Life", "difficulty": 1, "intro": "Watch this short video (placeholder) to see how AI is part of your daily life, from movie recommendations to spam filters in your email.", "video": "path/to/ai_in_life_video.mp4"}},
            {"task_type": "html", "action": "quiz", "metadata": {"caption": "Quiz: Identifying AI", "difficulty": 1, "questions": [{"text": "Which of these is most likely powered by AI?", "type": "single-choice", "answers": [{"text": "Calculator", "correct": false, "value": 0}, {"text": "Smart Speaker", "correct": true, "value": 1}, {"text": "Toaster", "correct": false, "value": 0}]}]}}
          ]
        },
        {
          "lesson_id": 1.2,
          "lesson_title": "The Magic of LLMs: Talking to AI!",
          "aim": "To introduce Large Language Models (LLMs) and the concepts of prompts and completions.",
          "tasks": [
            {"task_type": "html", "action": "text", "metadata": {"caption": "LLMs: Your New Language Superpower", "difficulty": 1, "problem": "<h1>Large Language Models</h1><p>Large Language Models (LLMs) are a type of AI that are amazing at understanding and creating human-like language. They are trained on vast amounts of text and can write stories, answer questions, translate languages, and much more!</p><p>A <strong>prompt</strong> is what you type into an LLM to ask it to do something. A <strong>completion</strong> is the LLM's response.</p>"}}
          ]
        }
      ]
    },
    {
      "module_id": 2,
      "module_title": "Talking to AI: The Art of Prompt Engineering",
      "lessons": [
        {
          "lesson_id": 2.1,
          "lesson_title": "The Power of Clarity: Be Specific!",
          "aim": "To understand the importance of clear and specific instructions when prompting AI.",
          "tasks": [
            {"task_type": "html", "action": "text", "metadata": {"caption": "Why Your AI Needs Crystal Clear Instructions", "difficulty": 1, "problem": "<h1>Be Specific!</h1><p>The golden rule of prompting is: the clearer your instruction, the better the AI's response will be. If you ask a vague question, you'll get a vague answer. If you want a specific output, tell the AI exactly what you're looking for.</p><p>For example, instead of 'Write a story,' try 'Write a short, funny story about a cat who learns to fly, set in a bustling city.' See the difference?</p>"}}
          ]
        }
      ]
    },
    {
      "module_id": 8,
      "module_title": "Your First AI-Powered Project: Smart Story Generator! (Capstone)",
      "lessons": [
        {"lesson_id": 8.1, "lesson_title": "Project Planning: Designing Your Story Generator", "aim": "To plan the structure and functionality of the application.", "tasks": [
          {"task_type": "html", "action": "text", "metadata": {"caption": "Project Blueprint: Planning Your AI Story", "difficulty": 2, "problem": "<h1>Planning Your Smart Story Generator</h1><p>Every great invention starts with a plan. Before we write code, we'll map out how our 'Smart Story Generator' will work.</p><ul><li>What kind of stories will it generate? (e.g., fantasy, sci-fi, adventure)</li><li>What inputs will the user provide? (e.g., main character, setting, plot twist)</li><li>What will the output look like?</li></ul><p>Thinking about these questions helps us design a better final product.</p>"}}
        ]},
        {"lesson_id": 8.2, "lesson_title": "Building Blocks: Coding Your Generator", "aim": "To write the core Python code for the story generator.", "tasks": [
          {"task_type": "code", "metadata": {"caption": "Code Challenge: Get Input", "difficulty": 2, "problem": "In Python, how do you get input from a user and store it in a variable called 'userName'?", "code_language": "python", "precode": {"python": "# Your code here\n# Hint: Use the input() function."}}}
        ]}
      ]
    }
  ]
};


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

  const handleQuizAnswer = async (questionText: string, studentAnswerText: string, isCorrect: boolean) => {
    if (isCorrect) {
      setQuizFeedback(null);
      toast({
        title: "Correct!",
        description: "Great job! Let's move to the next task.",
        variant: "default",
      });
      if (selectedLesson && selectedTaskIndex < selectedLesson.tasks.length - 1) {
        // Optionally auto-advance or provide a button.
      } else {
        toast({
          title: "Lesson Complete!",
          description: "You've finished all tasks in this lesson.",
        });
      }
    } else {
      if (!selectedLesson || !currentTask) return;
      setIsAILoading(true);
      setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: "Thinking of a hint..." });
      try {
        const lessonContentForAI = selectedLesson.aim + "\n" + 
          selectedLesson.tasks.map(t => {
            if ('problem' in t.metadata) return (t.metadata as HtmlTaskMetadata | CodeTaskMetadata).problem;
            if ('intro' in t.metadata) return (t.metadata as AdsTaskMetadata).intro;
            return t.metadata.caption;
          }).join("\n");

        const input: RewriteQuizQuestionInput = {
          question: questionText,
          studentAnswer: studentAnswerText,
          lessonContent: lessonContentForAI,
        };
        const result = await rewriteQuizQuestion(input);
        setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: result.rewrittenQuestion });
      } catch (error) {
        console.error("AI Error:", error);
        toast({
          title: "Error getting hint",
          description: "Could not generate a hint at this time. Please try again or check your connection.",
          variant: "destructive",
        });
        setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: "Could not load hint." });
      } finally {
        setIsAILoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-80 fixed top-0 left-0 h-full bg-card border-r border-border shadow-md flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-headline font-semibold text-primary flex items-center">
            <GraduationCap className="mr-2 h-7 w-7" />
            {courseData.course_name}
          </h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {courseData.modules.map(module => (
            <ModuleAccordion
              key={module.module_id}
              module={module}
              selectedLessonId={selectedLessonId}
              onLessonClick={(lessonId) => handleLessonClick(lessonId, module.module_id)}
              isActiveModule={selectedModuleId === module.module_id}
            />
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-80 p-8 overflow-y-auto">
        {!selectedLesson || !currentTask ? (
          <WelcomeMessage />
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-headline text-primary">{selectedLesson.lesson_title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground font-body italic pt-1">
                  <strong>Aim:</strong> {selectedLesson.aim}
                </CardDescription>
              </CardHeader>
            </Card>

            <TaskViewer
              task={currentTask}
              lesson={selectedLesson} 
              onQuizAnswer={handleQuizAnswer}
              quizFeedback={quizFeedback}
              isAILoading={isAILoading}
              clearQuizFeedback={() => setQuizFeedback(null)}
            />

            <div className="mt-8 flex justify-between items-center">
              <Button
                onClick={handlePrevTask}
                disabled={selectedTaskIndex === 0}
                variant="outline"
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground font-body">
                Task {selectedTaskIndex + 1} of {selectedLesson.tasks.length}
              </span>
              <Button
                onClick={handleNextTask}
                disabled={selectedTaskIndex === selectedLesson.tasks.length - 1}
                variant="outline"
                className="hover:bg-accent hover:text-accent-foreground"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Sidebar Components (ModuleAccordion, LessonItem) --- unchanged, but here for completeness
interface ModuleAccordionProps {
  module: Module;
  selectedLessonId: number | null;
  onLessonClick: (lessonId: number) => void;
  isActiveModule: boolean;
}

function ModuleAccordion({ module, selectedLessonId, onLessonClick, isActiveModule }: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(isActiveModule);

  useEffect(() => {
    if (isActiveModule) {
      setIsOpen(true);
    }
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
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
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


// --- Welcome Message --- unchanged
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

interface TaskDisplayProps {
  // Common props for all task displays, if any
  metadata: BaseTaskMetadata;
}

interface HtmlTaskDisplayProps extends TaskDisplayProps {
  task: HtmlTask;
  onQuizAnswer: (questionText: string, studentAnswerText: string, isCorrect: boolean) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
}

function HtmlTaskDisplay({ task, onQuizAnswer, quizFeedback, isAILoading, clearQuizFeedback }: HtmlTaskDisplayProps) {
  const metadata = task.metadata;

  // Quiz rendering logic
  if (task.action === 'quiz' && metadata.questions && metadata.questions.length > 0) {
    const currentQuizQuestion = metadata.questions[0]; // Assuming one question per quiz task for now
    const originalQuestionText = currentQuizQuestion.text;
    const displayedQuestionText = quizFeedback?.rewrittenQuestion || originalQuestionText;

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-headline font-semibold">{metadata.caption}</h3>
        {quizFeedback && quizFeedback.rewrittenQuestion && (
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
              onClick={() => onQuizAnswer(originalQuestionText, answer.text, !!answer.correct)}
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

  // Lecture/Text HTML rendering
  return (
    <div>
      <h3 className="text-2xl font-headline font-semibold mb-3">{metadata.caption}</h3>
      <div className="prose prose-lg max-w-none font-body course-html-content" dangerouslySetInnerHTML={{ __html: metadata.problem }} />
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

interface AdsTaskDisplayProps extends TaskDisplayProps {
  task: AdsTask;
}

function AdsTaskDisplay({ task }: AdsTaskDisplayProps) {
  const metadata = task.metadata;
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
      <p className="font-body text-lg">{metadata.intro}</p>
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border shadow-inner">
        {/* Placeholder for actual video player */}
        <PlayCircle className="w-16 h-16 text-muted-foreground" />
        <span className="sr-only">Video placeholder for {metadata.video}</span>
      </div>
      <p data-ai-hint="video player" className="text-sm text-center text-muted-foreground font-body">Video content is a placeholder. Source: {metadata.video_source || 'N/A'}</p>
      {metadata.faqs && metadata.faqs.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-1">FAQs:</h4>
          <ul className="list-disc list-inside text-sm">
            {metadata.faqs.map((faq, i) => <li key={i}>{faq}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

interface CodeTaskDisplayProps extends TaskDisplayProps {
  task: CodeTask;
}

function CodeTaskDisplay({ task }: CodeTaskDisplayProps) {
  const metadata = task.metadata;
  const lang = metadata.code_language;
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <CodeIcon className="w-4 h-4"/> 
        <span>Language: {lang}</span>
        <Star className="w-4 h-4 text-yellow-500"/>
        <span>Difficulty: {metadata.difficulty}</span>
      </div>
      <p className="font-body text-lg" dangerouslySetInnerHTML={{ __html: metadata.problem }} />
      <div className="bg-gray-900 text-gray-100 p-4 rounded-md shadow-md overflow-x-auto">
        <pre><code className={`language-${lang} font-code`}>{metadata.precode[lang] || ''}</code></pre>
      </div>
      {metadata.hint && <p className="text-sm italic text-muted-foreground">Hint: {metadata.hint}</p>}
    </div>
  );
}

// --- Task Viewer Component ---
interface TaskViewerProps {
  task: Task;
  lesson: Lesson; // Keep lesson for context if needed by tasks or AI
  onQuizAnswer: (questionText: string, studentAnswerText: string, isCorrect: boolean) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
}

function TaskViewer({ task, lesson, onQuizAnswer, quizFeedback, isAILoading, clearQuizFeedback }: TaskViewerProps) {
  const renderTaskContent = () => {
    switch (task.task_type) {
      case 'html':
        return <HtmlTaskDisplay 
                  task={task} 
                  onQuizAnswer={onQuizAnswer}
                  quizFeedback={quizFeedback}
                  isAILoading={isAILoading}
                  clearQuizFeedback={clearQuizFeedback}
                  metadata={task.metadata} 
                />;
      case 'ads':
        return <AdsTaskDisplay task={task} metadata={task.metadata} />;
      case 'code':
        return <CodeTaskDisplay task={task} metadata={task.metadata} />;
      default:
        // This case should ideally not be reached if types are correct
        const exhaustiveCheck: never = task; 
        return <p className="font-body">Unsupported task type: {exhaustiveCheck}</p>;
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-2">
        {/* Display common metadata like tags or difficulty rating here if desired */}
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
