"use client";

import React from 'react';
import { AdsTask } from '@/types/course'; // Adjust path
// import useCourseStore from '@/store/courseStore'; // If direct store access is needed

interface AdsTaskDisplayProps {
  task: AdsTask;
  // markTaskAsSolved might be called via an effect in a parent component (e.g. MainContentArea)
  // when this task type becomes active. If direct interaction here solves it, pass the function.
}

export default function AdsTaskDisplay({ task }: AdsTaskDisplayProps) {
  const metadata = task.metadata;
  // const { markTaskAsSolved, currentTaskId, selectedLessonId, selectedTaskIndex } = useCourseStore(state => ({...}));
  // If this component itself should mark the task as solved upon viewing/interaction.
  // For now, assuming parent (MainContentArea) handles this via useEffect.

  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
      {metadata.intro && <p className="font-body text-lg">{metadata.intro}</p>}
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border shadow-inner">
        {/* Placeholder for video player. In a real app, you'd use an <iframe/> or a video library. */}
        <img
          src={`https://placehold.co/600x400.png?text=${encodeURIComponent(metadata.caption)}`}
          alt={metadata.caption}
          className="w-full h-full object-cover rounded-lg"
          data-ai-hint="video player" // For AI tools if any are analyzing the page
        />
      </div>
      <p className="text-sm text-center text-muted-foreground font-body">
        Video content is a placeholder. Source: {metadata.video_source || 'N/A'}
      </p>
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
