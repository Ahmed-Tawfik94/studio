"use client";

import React from 'react';
import { Button } from "@/components/ui/button"; // Adjust path
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface TaskNavigationControlsProps {
  onPrevTask: () => void;
  onNextTask: () => void;
  selectedTaskIndex: number;
  totalTasks: number;
  isCurrentTaskSolved: boolean;
}

export default function TaskNavigationControls({
  onPrevTask,
  onNextTask,
  selectedTaskIndex,
  totalTasks,
  isCurrentTaskSolved
}: TaskNavigationControlsProps) {
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
        title={!isCurrentTaskSolved ? "Complete current task to proceed" : (isLastTask ? "Lesson Complete!" : "Next Task")}
      >
        {isLastTask ? "Finish Lesson" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
