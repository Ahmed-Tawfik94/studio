"use client";

import React, { useState, useEffect } from 'react';
import { GraduationCap, ChevronDown, ChevronRight, Lock, CheckCircle2, PlayCircle, Unlock, Loader2 } from 'lucide-react';
import { Module as FullModuleType, Lesson as FullLessonType, Task as GlobalTaskType } from '@/types/course';
import useCourseStore, { courseSelectors, useCourseStoreShallow, CourseState } from '@/store/courseStore';
import { useToast } from "@/hooks/use-toast";

// Define types for props, potentially using StoreModule/StoreLesson if exported from store
interface SidebarModule extends Omit<FullModuleType, 'lessons' | 'description' | 'what_students_will_build' | 'concepts_learned'> {
  lessons?: SidebarLesson[];
  lessonsLoaded?: boolean;
  aim?: string;
  description?: string;
}

interface SidebarLesson extends Omit<FullLessonType, 'tasks' | 'description' | 'what_students_will_build' | 'concepts_learned'> {
  tasks?: GlobalTaskType[];
  tasksLoaded?: boolean;
  aim: string;
}

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
  const storeSelectLesson = useCourseStore(state => state.selectLesson);

  // Use selectors directly with the state from the hook
  const isActive = useCourseStore(state => state.selectedLessonId === lesson.lesson_id);
  const isUnlocked = useCourseStore(state => courseSelectors.isLessonUnlocked(state, lesson.lesson_id, moduleId));
  const isComplete = useCourseStore(state => courseSelectors.isLessonComplete(state, lesson.lesson_id));

  const { toast } = useToast();

  const handleLessonClick = () => {
    if (!isUnlocked) {
      toast({
        title: <div className="flex items-center"><Lock className="h-5 w-5 mr-2" /><span>Lesson Locked</span></div>,
        description: "Complete previous lessons to unlock this one.",
        variant: "destructive",
      });
      return;
    }
    storeSelectLesson(lesson.lesson_id, moduleId);
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
    fetchModuleLessons,
    isLoadingModuleLessons,
    storeSelectModule
  } = useCourseStoreShallow(state => ({ // Using shallow for multiple non-primitive selections
    fetchModuleLessons: state.fetchModuleLessons,
    isLoadingModuleLessons: state.isLoadingModuleLessons,
    storeSelectModule: state.selectModule,
  }));

  const isActiveModule = useCourseStore(state => state.selectedModuleId === module.module_id);
  const isModuleUnlocked = useCourseStore(state => courseSelectors.isModuleUnlocked(state, module.module_id));

  const [isOpen, setIsOpen] = useState(isActiveModule && isModuleUnlocked);
  const { toast } = useToast();

  useEffect(() => {
    if (isModuleUnlocked) {
      setIsOpen(prevOpen => (isActiveModule ? true : prevOpen));
      // Logic for auto-fetching on active can be complex due to re-renders,
      // selectModule action in store already handles fetching for newly selected module.
      // Explicit fetch on expand (in handleAccordionToggle) is more predictable.
    } else {
      setIsOpen(false);
    }
  }, [isActiveModule, isModuleUnlocked]); // Removed module.lessonsLoaded etc. as direct action is better

  const handleAccordionToggle = () => {
    if (!isModuleUnlocked) {
      toast({
        title: <div className="flex items-center"><Lock className="h-5 w-5 mr-2" /><span>Module Locked</span></div>,
        description: "Complete the previous module to unlock this one.",
        variant: "destructive",
      });
      return;
    }

    if (!isActiveModule) { // If clicking to select/activate the module
        storeSelectModule(module.module_id); // This action in store now handles fetching lessons.
    } else { // If module is already active, just toggling open/close
        if (!isOpen && !module.lessonsLoaded && isLoadingModuleLessons !== module.module_id) {
          fetchModuleLessons(module.module_id);
        }
    }
    setIsOpen(!isOpen);
  };

  const lessons = module.lessons || [];

  return (
    <div className={`rounded-md border border-border shadow-sm transition-all duration-300 ease-in-out ${!isModuleUnlocked ? 'opacity-70 bg-muted/30' : ''}`}>
      <button
        onClick={handleAccordionToggle}
        aria-expanded={isOpen && isModuleUnlocked}
        // Allow clicking an active module to close it, or an unlocked inactive to open/select
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
      {isModuleUnlocked && isOpen && (
        <div
          id={`module-${module.module_id}-content`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
        >
          {isLoadingModuleLessons === module.module_id && (
            <div className="p-4 text-center flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading lessons...
            </div>
          )}
          {/* Ensure module.lessonsLoaded is true before trying to display lessons or "no lessons" message */}
          {module.lessonsLoaded && lessons.length === 0 && isLoadingModuleLessons !== module.module_id && (
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
  const modules = useCourseStore(state => state.modules); // This already returns StoreModule[]

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
            module={module} // module is of type StoreModule from the map
          />
        ))}
      </nav>
    </aside>
  );
}
