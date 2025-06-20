"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Adjust path
import { Lesson } from '@/types/course'; // Adjust path

interface LessonHeaderDisplayProps {
  lesson: Lesson;
}

export default function LessonHeaderDisplay({ lesson }: LessonHeaderDisplayProps) {
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
