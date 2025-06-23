"use client";

import React, { useEffect } from 'react';
import useCourseStore from '@/store/courseStore';
import { QuizQuestion, QuizAnswer, Task, Lesson } from '@/types/course';
import LessonHeaderDisplay from '@/components/course/LessonHeaderDisplay';
import TaskViewer from '@/components/tasks/TaskViewer';
import TaskNavigationControls from '@/components/course/TaskNavigationControls';
import WelcomeMessage from '@/components/course/WelcomeMessage';
import { useToast } from "@/hooks/use-toast";
import { rewriteQuizQuestion, RewriteQuizQuestionInput } from '@/ai/flows/rewrite-quiz-question';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
    // These imports are no longer needed as courseSelectors is part of courseStore import
    // getSelectedLesson as getStoreSelectedLesson,
    // getCurrentTask as getStoreCurrentTask,
    // getCurrentTaskId as getStoreCurrentTaskId,
    // isTaskConsideredSolved as getIsTaskConsideredSolved,
    // SelectorStateContext
} from '@/store/courseSelectors'; // This import will be removed
import useCourseStore, { courseSelectors, CourseState } from '@/store/courseStore'; // Added courseSelectors and CourseState

interface MainContentAreaProps {}

export default function MainContentArea({}: MainContentAreaProps) {
  // Select all necessary state pieces for this component and for passing to selectors
  const {
    selectedModuleId,
    selectedLessonId,
    selectedTaskIndex,
    modules,
    taskCompletionStatus,
    quizFeedback,
    isAILoading,
    isLoadingLessonTasks, // New loading state
    setQuizFeedback,
    setIsAILoading,
    markTaskAsSolved,
    selectTask,
    fetchLessonTasks, // Action to fetch tasks
  } = useCourseStore(state => ({
    selectedModuleId: state.selectedModuleId,
    selectedLessonId: state.selectedLessonId,
    selectedTaskIndex: state.selectedTaskIndex,
    modules: state.modules,
    taskCompletionStatus: state.taskCompletionStatus,
    quizFeedback: state.quizFeedback,
    isAILoading: state.isAILoading,
    isLoadingLessonTasks: state.isLoadingLessonTasks,
    setQuizFeedback: state.setQuizFeedback,
    setIsAILoading: state.setIsAILoading,
    markTaskAsSolved: state.markTaskAsSolved,
    selectTask: state.selectTask,
    fetchLessonTasks: state.fetchLessonTasks,
  }));

  const { toast } = useToast();

  // Use selectors directly from the store, passing the full state
  const currentLesson = useCourseStore(courseSelectors.selectedLesson) as Lesson | null; // Cast might still be needed if StoreLesson type from store differs from imported Lesson type
  const currentTask = useCourseStore(courseSelectors.currentTask) as Task | null; // Cast might still be needed
  const currentTaskId = useCourseStore(courseSelectors.currentTaskId);

  // For selectors that take parameters, we need to pass the state
  const currentTaskIsSolved = useCourseStore(state =>
    currentTask && currentLesson ? courseSelectors.isTaskConsideredSolved(state, currentLesson.lesson_id, selectedTaskIndex) : false
  );


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
  useEffect(() => {
    if (currentLesson && currentTask && (currentTask.task_type === 'ads' || (currentTask.task_type === 'html' && (currentTask.action === 'lecture' || currentTask.action === 'text')))) {
      // Re-evaluate 'solved' inside useEffect with fresh state if necessary, or ensure selectorContext is stable if used from outside
      const isSolved = useCourseStore.getState(); // Get fresh state
      const solved = courseSelectors.isTaskConsideredSolved(isSolved, currentLesson.lesson_id, selectedTaskIndex);
      if (currentTaskId && !solved) {
          markTaskAsSolved(currentLesson.lesson_id, selectedTaskIndex);
      }
    }
  // Dependencies need to be carefully managed. If selectorContext was used, its stability is key.
  // Now, explicitly list dependencies. selectedTaskIndex, currentLesson.lesson_id, currentTaskId, markTaskAsSolved, currentTask
  }, [currentTask, currentLesson?.lesson_id, selectedTaskIndex, currentTaskId, markTaskAsSolved]);
  // Note: currentLesson itself can be a dependency if its properties are accessed directly.

  // Effect to fetch lesson tasks if a lesson is selected but its tasks are not loaded
  useEffect(() => {
    if (currentLesson && !currentLesson.tasksLoaded && selectedModuleId && isLoadingLessonTasks !== currentLesson.lesson_id) {
      fetchLessonTasks(currentLesson.lesson_id, selectedModuleId);
    }
  }, [currentLesson, selectedModuleId, fetchLessonTasks, isLoadingLessonTasks]);


  if (!selectedLessonId || !currentLesson) {
    // If no lesson is selected, or lesson data is missing (e.g. still loading initial meta)
    return (
      <main className="flex-1 ml-80 p-8 overflow-y-auto">
        <WelcomeMessage />
      </main>
    );
  }

  if (isLoadingLessonTasks === selectedLessonId || (currentLesson && !currentLesson.tasksLoaded && !currentTask)) {
    // If tasks for the current lesson are loading, or lesson is loaded but tasks array is not yet populated
    return (
      <main className="flex-1 ml-80 p-8 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading tasks for {currentLesson?.lesson_title || 'lesson'}...</p>
        </div>
      </main>
    );
  }

  if (!currentTask) {
     // If tasks are supposedly loaded, but currentTask is still null (e.g. empty tasks array, or bad index)
    return (
      <main className="flex-1 ml-80 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            <LessonHeaderDisplay lesson={currentLesson} />
            <div className="p-4 text-center text-muted-foreground mt-6">
                <p>No task available for this lesson, or tasks are still loading.</p>
            </div>
            <TaskNavigationControls
              onPrevTask={handlePrevTask}
              onNextTask={handleNextTask}
              selectedTaskIndex={selectedTaskIndex}
              totalTasks={currentLesson.tasks?.length || 0}
              isCurrentTaskSolved={false} // No task to be solved
            />
        </div>
      </main>
    );
  }


  return (
    <main className="flex-1 ml-80 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <LessonHeaderDisplay lesson={currentLesson} />
        <TaskViewer
          task={currentTask}
          lessonId={currentLesson.lesson_id}
          taskIndex={selectedTaskIndex}
          onQuizAnswer={handleQuizAnswer}
          onGenericSubmit={handleGenericSubmit}
          quizFeedback={quizFeedback}
          isAILoading={isAILoading}
          clearQuizFeedback={() => setQuizFeedback(null)}
          markTaskAsSolved={() => markTaskAsSolved(currentLesson.lesson_id, selectedTaskIndex)}
        />
        <TaskNavigationControls
          onPrevTask={handlePrevTask}
          onNextTask={handleNextTask}
          selectedTaskIndex={selectedTaskIndex}
          totalTasks={currentLesson.tasks?.length || 0} // Handle case where tasks might be undefined briefly
          isCurrentTaskSolved={currentTaskIsSolved}
        />
      </div>
    </main>
  );
}
