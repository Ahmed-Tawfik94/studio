"use client";

import React, { useState } from 'react';
import { HtmlTask, QuizQuestion, QuizAnswer } from '@/types/course'; // Adjust path
import { Button } from "@/components/ui/button"; // Adjust path
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Adjust path
import { Lightbulb, RotateCcw, Loader2 } from 'lucide-react';
// import useCourseStore from '@/store/courseStore'; // If direct store access is needed for some state

interface HtmlTaskDisplayProps {
  task: HtmlTask;
  onQuizAnswer: (question: QuizQuestion, studentAnswer: QuizAnswer) => void;
  onGenericSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string, solveTask?: boolean) => void;
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  clearQuizFeedback: () => void;
  markTaskAsSolved: () => void; // To mark task as solved, e.g. for lecture type
}

export default function HtmlTaskDisplay({
  task,
  onQuizAnswer,
  onGenericSubmit,
  quizFeedback,
  isAILoading,
  clearQuizFeedback,
  markTaskAsSolved
}: HtmlTaskDisplayProps) {
  const metadata = task.metadata;

  // For free text blank
  const [userAnswer, setUserAnswer] = useState('');

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
    // Extract answer from "Answer: {{correct_answer}}"
    const correctAnswerMatch = metadata.answer.match(/\{\{(.*?)\}\}/);
    const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1] : '';


    const handleSubmitBlank = () => {
      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
      // For free text blank, success/failed messages might not be in questions. Using metadata directly or generic.
      // Assuming hint can be used as success/failure guidance if specific messages aren't available.
      onGenericSubmit(isCorrect, metadata.hint || "Correct!", metadata.hint || "Try again.");
    };

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-headline font-semibold">{metadata.caption}</h3>
        {metadata.problem && <div className="prose prose-lg max-w-none font-body course-html-content" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}

        <div className="flex items-center space-x-2 mt-2 font-body text-lg">
          {textBefore && <span dangerouslySetInnerHTML={{ __html: textBefore }} />}
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="border border-input rounded-md px-2 py-1 w-32 bg-background text-foreground"
            aria-label="Fill in the blank"
          />
          {textAfter && <span dangerouslySetInnerHTML={{ __html: textAfter }} />}
        </div>
        <Button onClick={handleSubmitBlank}>Submit Answer</Button>
        {metadata.hint && <p className="text-sm italic text-muted-foreground mt-2">Hint: {metadata.hint}</p>}
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

  // Lecture/Text HTML rendering
  // This type of task is often auto-completed. The markTaskAsSolved is already called by an effect in MainContentArea.
  // No interactive elements here usually, besides reading.
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
