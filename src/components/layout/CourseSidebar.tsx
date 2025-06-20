"use client";

import React, { useState, useEffect } from 'react';
import { GraduationCap, ChevronDown, ChevronRight, Lock, CheckCircle2, PlayCircle, Unlock } from 'lucide-react';
import { Module, Lesson } from '@/types/course'; // Adjust path as necessary
import useCourseStore from '@/store/courseStore'; // Adjust path as necessary
import { useToast } from "@/hooks/use-toast"; // Adjust path as necessary

interface CourseSidebarProps {
  courseName: string;
  // Modules will be fetched from the store
}

interface ModuleAccordionProps {
  module: Module;
  // selectedLessonId, onLessonClick, isActiveModule, isModuleUnlocked,
  // isLessonUnlocked, isLessonComplete, selectedModuleId will be from store or derived
}

interface LessonItemProps {
  lesson: Lesson;
  moduleId: number; // Pass moduleId to handle lesson click correctly
  // onClick, isActive, isUnlocked, isComplete will be from store or derived
}

function LessonItem({ lesson, moduleId }: LessonItemProps) {
  const {
    selectedLessonId,
    selectLesson,
    isLessonUnlocked: isStoreLessonUnlocked, // Renaming to avoid conflict if passed as prop
    isLessonComplete: isStoreLessonComplete
  } = useCourseStore(state => ({
    selectedLessonId: state.selectedLessonId,
    selectLesson: state.selectLesson,
    isLessonUnlocked: state.isLessonUnlocked,
    isLessonComplete: state.isLessonComplete,
  }));

  const isActive = selectedLessonId === lesson.lesson_id;
  const isUnlocked = isStoreLessonUnlocked(lesson.lesson_id, moduleId);
  const isComplete = isStoreLessonComplete(lesson.lesson_id);

  const { toast } = useToast();

  const handleLessonClick = () => {
    if (!isUnlocked) {
      toast({
        title: (
          <div className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            <span>Lesson Locked</span>
          </div>
        ),
        description: "Complete previous lessons to unlock this one.",
        variant: "destructive",
      });
      return;
    }
    selectLesson(lesson.lesson_id, moduleId);
  };

  let icon = null;
  if (!isUnlocked) {
    icon = <Lock className="mr-2 h-4 w-4 flex-shrink-0" />;
  } else if (isComplete) {
    icon = <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />;
  } else if (isActive) {
     icon = <PlayCircle className="mr-2 h-4 w-4 text-primary flex-shrink-0" />;
  } else {
    icon = <Unlock className="mr-2 h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
  }

  return (
    <li>
      <button
        onClick={handleLessonClick}
        disabled={!isUnlocked}
        className={`w-full text-left p-3 rounded-md font-body transition-all duration-200 ease-in-out flex items-center
                    ${isActive && isUnlocked
                      ? 'bg-primary text-primary-foreground font-semibold shadow-inner'
                      : isUnlocked
                        ? 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                        : 'text-muted-foreground cursor-not-allowed bg-muted/50'
                    }
                    ${isComplete && isUnlocked ? 'border-l-4 border-green-500' : ''}
                  `}
      >
        {icon}
        <span className="truncate">{lesson.lesson_title}</span>
      </button>
    </li>
  );
}

function ModuleAccordion({ module }: ModuleAccordionProps) {
  const {
    selectedModuleId,
    isModuleUnlocked: isStoreModuleUnlocked,
    // selectModule, // Not directly selecting module here, but could be added
   } = useCourseStore(state => ({
    selectedModuleId: state.selectedModuleId,
    isModuleUnlocked: state.isModuleUnlocked,
    // selectModule: state.selectModule, // If needed for other interactions
  }));

  const isActiveModule = selectedModuleId === module.module_id;
  const isModuleUnlocked = isStoreModuleUnlocked(module.module_id);
  const [isOpen, setIsOpen] = useState(isActiveModule && isModuleUnlocked);
  const { toast } = useToast();

  useEffect(() => {
    if (isModuleUnlocked) {
        setIsOpen(prevOpenState => (isActiveModule ? true : prevOpenState));
    } else {
        setIsOpen(false);
    }
  }, [isActiveModule, isModuleUnlocked]);

  const toggleOpen = () => {
    if (!isModuleUnlocked) {
      toast({
        title: (
          <div className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            <span>Module Locked</span>
          </div>
        ),
        description: "Complete the previous module to unlock this one.",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`rounded-md border border-border shadow-sm transition-all duration-300 ease-in-out ${!isModuleUnlocked ? 'opacity-70 bg-muted/30' : ''}`}>
      <button
        onClick={toggleOpen}
        aria-expanded={isOpen && isModuleUnlocked}
        disabled={!isModuleUnlocked && !isActiveModule}
        className={`w-full flex items-center justify-between p-4 text-left font-headline font-medium text-lg
                    ${isModuleUnlocked ? 'hover:bg-accent transition-colors duration-200' : 'cursor-not-allowed'} rounded-t-md`}
        aria-controls={`module-${module.module_id}-content`}
      >
        <span className="flex items-center">
          {!isModuleUnlocked && <Lock className="mr-2 h-4 w-4 text-muted-foreground" />}
          {module.module_title}
        </span>
        {isModuleUnlocked && (isOpen ? <ChevronDown className="h-5 w-5 text-primary" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />)}
      </button>
      {isModuleUnlocked && (
        <div
          id={`module-${module.module_id}-content`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
        >
          <ul className="p-2 space-y-1 bg-background rounded-b-md">
            {module.lessons.map(lesson => (
              <LessonItem
                key={lesson.lesson_id}
                lesson={lesson}
                moduleId={module.module_id} // Pass moduleId
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CourseSidebar({ courseName }: CourseSidebarProps) {
  const modules = useCourseStore(state => state.courseData.modules);

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
          />
        ))}
      </nav>
    </aside>
  );
}
