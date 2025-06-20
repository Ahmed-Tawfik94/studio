"use client";

import React, { useState, useEffect } from 'react';
import { GraduationCap, ChevronDown, ChevronRight, Lock, CheckCircle2, PlayCircle, Unlock, Loader2 } from 'lucide-react';
import { Module as FullModuleType, Lesson as FullLessonType } from '@/types/course'; // Original full types
import useCourseStore from '@/store/courseStore';
import { useToast } from "@/hooks/use-toast";
import {
  isLessonUnlocked as getIsLessonUnlocked,
  isLessonComplete as getIsLessonComplete,
  isModuleUnlocked as getIsModuleUnlocked,
  SelectorStateContext // Type for state passed to selectors
} from '@/store/courseSelectors';

// Reflecting the store's new structure for modules and lessons
interface SidebarModule extends Omit<FullModuleType, 'lessons' | 'description' | 'what_students_will_build' | 'concepts_learned'> {
  lessons?: SidebarLesson[];
  lessonsLoaded?: boolean;
  // Add back other module fields if they are part of the course-meta.json and needed for display
  aim?: string;
  description?: string;
}

interface SidebarLesson extends Omit<FullLessonType, 'tasks' | 'description' | 'what_students_will_build' | 'concepts_learned'> {
  tasks?: Task[]; // Task type from '@/types/course'
  tasksLoaded?: boolean;
   aim: string; // Ensure aim is part of SidebarLesson if it's used by LessonItem or selectors
}
// Temporary Task type placeholder if not importing full Task type
type Task = any;


interface CourseSidebarProps {
  courseName: string;
}

interface ModuleAccordionProps {
  module: SidebarModule;
}

interface LessonItemProps {
  lesson: SidebarLesson;
  moduleId: number;
}

function LessonItem({ lesson, moduleId }: LessonItemProps) {
  const {
    selectedLessonId,
    selectLesson: storeSelectLesson,
    modules, // Full modules array from store for context
    taskCompletionStatus
  } = useCourseStore(state => ({
    selectedLessonId: state.selectedLessonId,
    selectLesson: state.selectLesson,
    modules: state.modules,
    taskCompletionStatus: state.taskCompletionStatus,
  }));

  // Prepare state for selectors
  const selectorContext: SelectorStateContext = { modules, taskCompletionStatus, selectedLessonId };

  const isActive = selectedLessonId === lesson.lesson_id;
  const isUnlocked = getIsLessonUnlocked(selectorContext, lesson.lesson_id, moduleId);
  const isComplete = getIsLessonComplete(selectorContext, lesson.lesson_id);

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
    storeSelectLesson(lesson.lesson_id, moduleId); // Calls the store action
    // Task fetching is now handled by the selectLesson action in the store
    // if (!lesson.tasksLoaded) {
    //   fetchLessonTasks(lesson.lesson_id, moduleId);
    // }
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
    modules: storeModules, // Renamed to avoid conflict with 'module' prop
    taskCompletionStatus,
    fetchModuleLessons,
    isLoadingModuleLessons,
    selectModule: storeSelectModule // Renamed to avoid conflict
  } = useCourseStore(state => ({
    selectedModuleId: state.selectedModuleId,
    modules: state.modules,
    taskCompletionStatus: state.taskCompletionStatus,
    fetchModuleLessons: state.fetchModuleLessons,
    isLoadingModuleLessons: state.isLoadingModuleLessons,
    selectModule: state.selectModule,
  }));

  // Prepare state for selectors
  const selectorContext: SelectorStateContext = { modules: storeModules, taskCompletionStatus, selectedModuleId };

  const isActiveModule = selectedModuleId === module.module_id;
  const isModuleUnlocked = getIsModuleUnlocked(selectorContext, module.module_id);
  const [isOpen, setIsOpen] = useState(isActiveModule && isModuleUnlocked);
  const { toast } = useToast();

  useEffect(() => {
    if (isModuleUnlocked) {
      setIsOpen(prevOpen => (isActiveModule ? true : prevOpen));
      if (isActiveModule && !module.lessonsLoaded && !isLoadingModuleLessons) {
         // This logic might be better placed in the toggleOpen or a dedicated "onExpand" handler
         // if fetchModuleLessons should only be called on explicit user interaction to open.
         // For now, if active and lessons not loaded, try fetching.
         // The store's selectModule action now also triggers fetchModuleLessons.
      }
    } else {
      setIsOpen(false);
    }
  }, [isActiveModule, isModuleUnlocked, module.lessonsLoaded, isLoadingModuleLessons, fetchModuleLessons, module.module_id]);

  const handleAccordionToggle = () => {
    if (!isModuleUnlocked) {
      toast({
        title: <div className="flex items-center"><Lock className="h-5 w-5 mr-2" /><span>Module Locked</span></div>,
        description: "Complete the previous module to unlock this one.",
        variant: "destructive",
      });
      return;
    }

    // If opening the accordion and lessons aren't loaded and not currently loading
    if (!isOpen && !module.lessonsLoaded && isLoadingModuleLessons !== module.module_id) {
      fetchModuleLessons(module.module_id);
    }
    // If the module is not active, selecting it will also handle fetching lessons.
    // This ensures that clicking the accordion header to open it OR to select the module
    // results in lessons being loaded.
    if (!isActiveModule) {
        storeSelectModule(module.module_id); // This action in store now handles fetching lessons.
    }

    setIsOpen(!isOpen);
  };

  const lessons = module.lessons || [];

  return (
    <div className={`rounded-md border border-border shadow-sm transition-all duration-300 ease-in-out ${!isModuleUnlocked ? 'opacity-70 bg-muted/30' : ''}`}>
      <button
        onClick={handleAccordionToggle}
        aria-expanded={isOpen && isModuleUnlocked}
        disabled={!isModuleUnlocked && !isActiveModule && !isOpen} // Allow clicking an active module to close it
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
      {isModuleUnlocked && isOpen && (
        <div
          id={`module-${module.module_id}-content`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`} // max-h should be controlled by isOpen
        >
          {isLoadingModuleLessons === module.module_id && (
            <div className="p-4 text-center flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading lessons...
            </div>
          )}
          {module.lessonsLoaded && lessons.length === 0 && !isLoadingModuleLessons && (
             <div className="p-4 text-center text-muted-foreground">No lessons in this module.</div>
          )}
          {module.lessonsLoaded && lessons.length > 0 && (
            <ul className="p-2 space-y-1 bg-background rounded-b-md">
              {lessons.map(lesson => (
                <LessonItem
                  key={lesson.lesson_id}
                  lesson={lesson}
                  moduleId={module.module_id}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseSidebar({ courseName }: CourseSidebarProps) {
  // Now directly use `modules` from the store, which are of type `StoreModule[]`
  const modules = useCourseStore(state => state.modules);

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
