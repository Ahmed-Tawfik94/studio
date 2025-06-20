"use client";

import React, { useState, useEffect } from 'react';
import { CodeTask } from '@/types/course'; // Adjust path
import { Button } from "@/components/ui/button"; // Adjust path
// import { Textarea } from "@/components/ui/textarea"; // No longer using Textarea for code
import { CodeIcon } from 'lucide-react';
import Editor from '@monaco-editor/react';
// import useCourseStore from '@/store/courseStore'; // If direct store access is needed

interface CodeTaskDisplayProps {
  task: CodeTask;
  onGenericSubmit: (isCorrect: boolean, successMsg?: string, failedMsg?: string, solveTask?: boolean) => void;
  markTaskAsSolved: () => void;
}

export default function CodeTaskDisplay({ task, onGenericSubmit, markTaskAsSolved }: CodeTaskDisplayProps) {
  const metadata = task.metadata;
  let lang = metadata.code_language || metadata.language || 'plaintext';
  // Monaco uses 'python', 'javascript', etc. 'text' should be 'plaintext'
  if (lang === "text" || lang === "txt") lang = "plaintext";
  if (lang === "py") lang = "python";
  if (lang === "js") lang = "javascript";
  if (lang === "html") lang = "html";
  // Add other mappings as necessary

  const getInitialCode = () => {
    if (typeof metadata.precode === 'object' && metadata.precode !== null) {
      return metadata.precode[lang] || '';
    }
    return typeof metadata.precode === 'string' ? metadata.precode : '';
  };

  const [userCode, setUserCode] = useState(getInitialCode());
  const [userBlankAnswer, setUserBlankAnswer] = useState('');

  useEffect(() => {
    setUserCode(getInitialCode());
    setUserBlankAnswer('');
  }, [task, lang]); // metadata.precode is part of task, so it's implicitly a dependency


  const handleCodeSubmit = () => {
    // This is for action: 'code' (full code editor)
    if (task.action === 'code' && metadata.answer && metadata.answer.length > 0) {
      const expectedAnswerObj = metadata.answer.find(ans => ans[lang] !== undefined);
      const expectedCode = expectedAnswerObj ? expectedAnswerObj[lang] : undefined;

      if (expectedCode) {
        // Basic string comparison. More complex validation might be needed.
        const isCorrect = userCode.trim() === expectedCode.trim();
        onGenericSubmit(isCorrect, "Code Submitted Correctly!", "Code is not quite right. Check your logic.", isCorrect);
      } else {
        // No specific answer for this language, consider it 'processed' rather than 'correct' or 'incorrect'
        onGenericSubmit(true, "Code Submitted!", "Could not verify code for this language.", false);
        markTaskAsSolved(); // Mark as solved if no specific answer to check against
      }
    } else {
      // For tasks without a specific answer, or other code actions not 'code_blank'
      onGenericSubmit(true, "Code Processed", "No specific check for this task.", false);
      markTaskAsSolved();
    }
  };

  const handleSubmitCodeBlank = () => {
    // This is for action: 'code_blank'
    if (task.action === 'code_blank' && metadata.solution) {
        const solutionsForLang = metadata.solution?.[lang];
        // Assuming the first blank (key "0") for simplicity, as in original code
        const correctAnswersForBlank = solutionsForLang?.["0"];

        if (correctAnswersForBlank && correctAnswersForBlank.includes(userBlankAnswer.trim())) {
            onGenericSubmit(true, "Correct!", "Try again!"); // solveTask defaults to true
        } else {
            onGenericSubmit(false, "Correct!", "Try again!"); // Failed, don't solve task
        }
    } else {
        // Fallback if structure is not as expected
        onGenericSubmit(true, "Answer Submitted", "Cannot verify this blank.", false);
        markTaskAsSolved();
    }
  };

  if (task.action === 'code_blank' && metadata.precode && typeof metadata.precode === 'object' && metadata.precode[lang] && metadata.solution) {
    const precodeContent = metadata.precode[lang] as string;
    // Split by {{}} or { { } } or similar, robustly handling spaces
    const precodeParts = precodeContent.split(/\{\{\s*\}\}|\{\s*\{\s*\}\s*\}/g);
    let blankInputRendered = false;

    return (
      <div className="space-y-3">
        <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
        {metadata.intro && <p className="font-body text-muted-foreground mb-2">{metadata.intro}</p>}
        {metadata.problem && <div className="font-body text-lg prose prose-lg max-w-none course-html-content" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}

        <div className="bg-gray-900 text-gray-100 p-4 rounded-md shadow-md font-code">
          {precodeParts.map((part, idx) => {
            const isLastPart = idx === precodeParts.length - 1;
            if (!blankInputRendered && (idx < precodeParts.length -1 || precodeContent.endsWith("{{}}")) ) {
              // Render part, then input if not already rendered and there's a next part or it ends with placeholder
              blankInputRendered = true;
              return (
                <React.Fragment key={idx}>
                  <span dangerouslySetInnerHTML={{__html: part}} />
                  <input
                    type="text"
                    value={userBlankAnswer}
                    onChange={(e) => setUserBlankAnswer(e.target.value)}
                    className="bg-gray-700 text-gray-100 border border-gray-600 rounded mx-1 px-1 py-0.5 w-32 focus:ring-primary focus:border-primary"
                    aria-label={`Fill in blank for code segment`}
                  />
                </React.Fragment>
              );
            }
            // Render remaining part or if no blank was intended before it
            return <span key={idx} dangerouslySetInnerHTML={{__html: part}} />;
          })}
        </div>
        <Button onClick={handleSubmitCodeBlank}>Submit Code Answer</Button>
        {metadata.hint && <p className="text-sm italic text-muted-foreground">Hint: {metadata.hint}</p>}
         <style jsx global>{`
            .course-html-content h1 { @apply text-2xl font-headline font-semibold mb-4 mt-6 text-primary; }
            .course-html-content h2 { @apply text-xl font-headline font-semibold mb-3 mt-5; }
            /* Add other prose styles as needed */
          `}</style>
      </div>
    );
  }

  // Default code task display (action: 'code' or other unhandled specific code actions)
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-headline font-semibold">{metadata.caption}</h3>
       {metadata.intro && <p className="font-body text-muted-foreground mb-2">{metadata.intro}</p>}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <CodeIcon className="w-4 h-4"/>
        <span>Language: {lang}</span>
      </div>
      {metadata.problem && <div className="font-body text-lg prose prose-lg max-w-none course-html-content" dangerouslySetInnerHTML={{ __html: metadata.problem }} />}

      <div className="rounded-md border border-input shadow-sm">
        <Editor
          height="200px" // Default height
          language={lang}
          theme="vs-dark" // Or any other theme like "light"
          value={userCode}
          onChange={(value) => setUserCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true, // Adjusts editor layout on container size changes
          }}
        />
      </div>
      <Button onClick={handleCodeSubmit}>Submit Code</Button>
      {metadata.hint && <p className="text-sm italic text-muted-foreground">Hint: {metadata.hint}</p>}

      {/* Conceptual UI for Python Package Specification - Not functional for actual package installation */}
      {lang === 'python' && metadata.problem && metadata.problem.toLowerCase().includes("package") && ( // Example condition
        <div className="mt-4 p-3 border border-dashed rounded-md">
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Conceptual: Required Packages</h4>
            <p className="text-xs text-muted-foreground">
                For a real Python environment, you might need to install packages. This UI is a placeholder.
            </p>
            {/*
            Example: Display packages if they were in metadata
            {metadata.required_packages && metadata.required_packages.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-muted-foreground pl-4 mt-1">
                {metadata.required_packages.map((pkg: string) => <li key={pkg}>{pkg}</li>)}
                </ul>
            ) : <p className="text-xs text-muted-foreground mt-1">None specified for this task.</p>}
            */}
        </div>
      )}

       {metadata.events && metadata.drawing && ( // Placeholder for drawing area
        <div>
          <h4 className="font-semibold mt-2">Drawing Area &amp; Events:</h4>
          <div className="border border-dashed border-input p-4 mt-1 rounded-md min-h-[200px] bg-muted/50 flex items-center justify-center">
             <img src="https://placehold.co/300x200.png?text=Drawing+Canvas" alt="Drawing canvas placeholder" data-ai-hint="drawing canvas" />
          </div>
          {metadata.events && metadata.events.length > 0 && (
            <ul className="list-disc list-inside text-sm mt-1">
                {metadata.events.map(event => <li key={event.key}>{event.caption} (key: {event.key})</li>)}
            </ul>
          )}
        </div>
      )}
       <style jsx global>{`
        .course-html-content h1 { @apply text-2xl font-headline font-semibold mb-4 mt-6 text-primary; }
        .course-html-content h2 { @apply text-xl font-headline font-semibold mb-3 mt-5; }
        /* Add other prose styles as needed */
      `}</style>
    </div>
  );
}
