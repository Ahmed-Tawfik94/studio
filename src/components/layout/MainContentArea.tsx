"use client";

import React from 'react';
import useCourseStore from '@/store/courseStore'; // Adjust path as necessary
import { Lesson, Task, QuizQuestion, QuizAnswer } from '@/types/course'; // Adjust path as necessary
import LessonHeaderDisplay from '@/components/course/LessonHeaderDisplay'; // Will be created
import TaskViewer from '@/components/tasks/TaskViewer'; // Will be created
import TaskNavigationControls from '@/components/course/TaskNavigationControls'; // Will be created
import WelcomeMessage from '@/components/course/WelcomeMessage'; // Will be created
import { useToast } from "@/hooks/use-toast"; // Adjust path as necessary
import { rewriteQuizQuestion, RewriteQuizQuestionInput } from '@/ai/flows/rewrite-quiz-question'; // Adjust path
import { CheckCircle2, XCircle, AlertCircle, Lock } from 'lucide-react'; // For toast icons

// Props are now mostly derived from the store
interface MainContentAreaProps {}

export default function MainContentArea({}: MainContentAreaProps) {
  const {
    selectedLesson,
    currentTask,
    selectedTaskIndex,
    quizFeedback,
    isAILoading,
    setQuizFeedback,
    setIsAILoading,
    markTaskAsSolved,
    selectTask,
    isTaskConsideredSolved,
    // Actions for navigation will be handled by TaskNavigationControls or locally if simple
  } = useCourseStore(state => ({
    selectedLesson: state.selectedLesson(),
    currentTask: state.currentTask(),
    selectedTaskIndex: state.selectedTaskIndex,
    quizFeedback: state.quizFeedback,
    isAILoading: state.isAILoading,
    setQuizFeedback: state.setQuizFeedback,
    setIsAILoading: state.setIsAILoading,
    markTaskAsSolved: state.markTaskAsSolved,
    selectTask: state.selectTask,
    isTaskConsideredSolved: state.isTaskConsideredSolved,
  }));

  const { toast } = useToast();

  const currentLesson = selectedLesson; // Alias for clarity
  const task = currentTask; // Alias for clarity

  // Ensure these are correctly using store state/selectors
  const currentTaskId = useCourseStore(state => state.currentTaskId());
  const currentTaskIsSolved = currentTask && currentLesson ? isTaskConsideredSolved(currentLesson.lesson_id, selectedTaskIndex) : false;


  const handleQuizAnswer = async (question: QuizQuestion, studentAnswer: QuizAnswer) => {
    if (!currentLesson || !task) return;

    const questionText = question.text;
    const studentAnswerText = studentAnswer.text;
    const isCorrect = studentAnswer.value.toString() === question.answer;

    if (isCorrect) {
      setQuizFeedback(null);
      if (currentTaskId) markTaskAsSolved(currentLesson.lesson_id, selectedTaskIndex);
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" /> {/* Icon color will be inherited or use text-current */}
            <span>{question.success || "Correct!"}</span>
          </div>
        ),
        description: "Great job!",
        variant: "success",
      });
    } else {
      setIsAILoading(true);
      setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: "Thinking of a hint..." });
      try {
        const lessonContentForAI = currentLesson.aim + "\n" + (currentLesson.description || "") + "\n" +
          currentLesson.tasks.map(t => t.metadata.problem || t.metadata.intro || t.metadata.caption).join("\n\n");

        const input: RewriteQuizQuestionInput = {
          question: questionText,
          studentAnswer: studentAnswerText,
          lessonContent: lessonContentForAI,
        };
        const result = await rewriteQuizQuestion(input);
        setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: result.rewrittenQuestion });
        toast({
            title: (
              <div className="flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                <span>{question.failed || "Not quite!"}</span>
              </div>
            ),
            description: "Here's a hint to help you.",
            variant: "destructive",
        });
      } catch (error) {
        console.error("AI Error:", error);
        toast({
          title: (
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Error getting hint</span>
            </div>
          ),
          description: "Could not generate a hint at this time.",
          variant: "destructive",
        });
        setQuizFeedback({ question: questionText, studentAnswer: studentAnswerText, rewrittenQuestion: "Could not load hint." });
      } finally {
        setIsAILoading(false);
      }
    }
  };

  const handleGenericSubmit = (isCorrect: boolean, successMsg?: string, failedMsg?: string, solveTask: boolean = true) => {
    if (!currentLesson) return;
    if (isCorrect) {
      if(solveTask && currentTaskId) markTaskAsSolved(currentLesson.lesson_id, selectedTaskIndex);
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span>{successMsg || "Correct!"}</span>
          </div>
        ),
        description: "Well done!",
        variant: "success",
      });
    } else {
      toast({
        title: (
          <div className="flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            <span>{failedMsg || "Not quite!"}</span>
          </div>
        ),
        description: "Try that again.",
        variant: "destructive",
      });
    }
  };

  const handleNextTask = () => {
    if (currentLesson && selectedTaskIndex < currentLesson.tasks.length - 1) {
      if (currentTaskIsSolved) {
        selectTask(selectedTaskIndex + 1);
        setQuizFeedback(null);
      } else {
        toast({
          title: "Task Not Completed",
          description: "Please complete the current task before moving to the next one.",
          variant: "destructive",
        });
      }
    } else if (currentLesson && selectedTaskIndex === currentLesson.tasks.length - 1 && currentTaskIsSolved) {
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span>Lesson Complete!</span>
          </div>
        ),
        description: "You've finished all tasks in this lesson.",
        variant: "success",
      });
    }
  };

  const handlePrevTask = () => {
    if (selectedTaskIndex > 0) {
      selectTask(selectedTaskIndex - 1);
      setQuizFeedback(null);
    }
  };

  // Effect to mark lecture/ads tasks as solved when they become current
  React.useEffect(() => {
    if (currentLesson && task && (task.task_type === 'ads' || (task.task_type === 'html' && (task.action === 'lecture' || task.action === 'text')))) {
      if (currentTaskId && !isTaskConsideredSolved(currentLesson.lesson_id, selectedTaskIndex)) {
          markTaskAsSolved(currentLesson.lesson_id, selectedTaskIndex);
      }
    }
  }, [task, currentTaskId, markTaskAsSolved, isTaskConsideredSolved, currentLesson, selectedTaskIndex]);


  if (!currentLesson || !task) {
    return (
      <main className="flex-1 ml-80 p-8 overflow-y-auto"> {/* Ensure ml-80 matches sidebar width */}
        <WelcomeMessage />
      </main>
    );
  }

  return (
    <main className="flex-1 ml-80 p-8 overflow-y-auto"> {/* Ensure ml-80 matches sidebar width */}
      <div className="max-w-4xl mx-auto">
        <LessonHeaderDisplay lesson={currentLesson} />
        <TaskViewer
          // Props for TaskViewer will be simplified as it will also use the store for task-specific data
          // For now, passing what's directly needed or was previously passed.
          // This will be refined when TaskViewer and its children are created.
          task={task}
          lessonId={currentLesson.lesson_id}
          taskIndex={selectedTaskIndex}
          onQuizAnswer={handleQuizAnswer}
          onGenericSubmit={handleGenericSubmit}
          quizFeedback={quizFeedback}
          isAILoading={isAILoading}
          clearQuizFeedback={() => setQuizFeedback(null)}
          markTaskAsSolved={() => markTaskAsSolved(currentLesson.lesson_id, selectedTaskIndex)} // Ensure args match
        />
        <TaskNavigationControls
          onPrevTask={handlePrevTask}
          onNextTask={handleNextTask}
          selectedTaskIndex={selectedTaskIndex}
          totalTasks={currentLesson.tasks.length}
          isCurrentTaskSolved={currentTaskIsSolved}
        />
      </div>
    </main>
  );
}
