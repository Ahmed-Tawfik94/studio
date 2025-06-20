"use client";

import React from 'react';
import useCourseStore from '@/store/courseStore'; // Adjust path
import { Task, QuizQuestion, QuizAnswer } from '@/types/course'; // Adjust path
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Adjust path
import { Badge } from "@/components/ui/badge"; // Adjust path
import HtmlTaskDisplay from './HtmlTaskDisplay'; // Will be created
import AdsTaskDisplay from './AdsTaskDisplay';   // Will be created
import CodeTaskDisplay from './CodeTaskDisplay'; // Will be created
import { BookOpen, MonitorPlay, Film, Terminal, Star } from 'lucide-react';

interface TaskViewerProps {
  task: Task; // Current task is passed as a prop
  lessonId: number; // Needed for context in some operations
  taskIndex: number; // Needed for context in some operations

  // Event handlers - these might be simplified if children components also use the store
  onQuizAnswer: (question: QuizQuestion, studentAnswer: QuizAnswer) => void;
  onGenericSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string, solveTask?: boolean) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
  markTaskAsSolved: () => void; // Simplified to not require lessonId/taskIndex if current task is implied
}

export default function TaskViewer({
  task,
  lessonId,
  taskIndex,
  onQuizAnswer,
  onGenericSubmit,
  quizFeedback,
  isAILoading,
  clearQuizFeedback,
  markTaskAsSolved
}: TaskViewerProps) {

  const getTaskIcon = (taskType: string, action?: string) => {
    if (taskType === 'html' && (action === 'lecture' || action === 'text')) return <BookOpen className="w-5 h-5 mr-2 text-primary" />;
    if (taskType === 'html') return <MonitorPlay className="w-5 h-5 mr-2 text-primary" />;
    if (taskType === 'ads') return <Film className="w-5 h-5 mr-2 text-primary" />;
    if (taskType === 'code') return <Terminal className="w-5 h-5 mr-2 text-primary" />;
    return <BookOpen className="w-5 h-5 mr-2 text-primary" />;
  };

  const getTaskTypeLabel = (taskType: string, action?: string) => {
    if (taskType === 'html' && action === 'lecture') return 'Lecture';
    if (taskType === 'html' && action === 'text') return 'Reading';
    if (taskType === 'html' && action === 'quiz') return 'Quiz';
    if (taskType === 'html' && action === 'blank') return 'Fill in the Blank';
    if (taskType === 'ads') return 'Video';
    if (taskType === 'code' && action === 'code_blank') return 'Code Blank';
    if (taskType === 'code') return 'Coding Challenge';
    const typeLabel = taskType.replace(/_/g, ' ');
    return typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);
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
                  markTaskAsSolved={markTaskAsSolved} // Pass down markTaskAsSolved
                />;
      case 'ads':
        return <AdsTaskDisplay task={task} />; // AdsTaskDisplay might call markTaskAsSolved via store or prop
      case 'code':
        return <CodeTaskDisplay
                  task={task}
                  onGenericSubmit={onGenericSubmit}
                  markTaskAsSolved={markTaskAsSolved} // Pass down markTaskAsSolved
                />;
      default:
        // This case should ideally not be reached if types are correct
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
