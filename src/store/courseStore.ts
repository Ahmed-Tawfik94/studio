import create from 'zustand';
import courseDataFromFile from '@/data/courseData'; // Adjust path as necessary
import {
  Course,
  Module,
  Lesson,
  Task,
  QuizQuestion,
  QuizAnswer
} from '@/types/course'; // Assuming types are defined here or adjust path

// Helper to get task ID
const getTaskId = (lessonId: number, taskIndex: number) => `${lessonId}-${taskIndex}`;

// Initial data
const course: Course = courseDataFromFile;

interface CourseState {
  selectedModuleId: number | null;
  selectedLessonId: number | null;
  selectedTaskIndex: number;
  taskCompletionStatus: { [key: string]: boolean };
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;
  courseData: Course;

  // Selectors (derived state)
  selectedModule: () => Module | null;
  selectedLesson: () => Lesson | null;
  currentTask: () => Task | null;
  currentTaskId: () => string;
  isTaskConsideredSolved: (lessonId: number, taskIndex: number) => boolean;
  isLessonComplete: (lessonId: number) => boolean;
  isModuleComplete: (moduleId: number) => boolean;
  isLessonUnlocked: (lessonId: number, moduleId: number) => boolean;
  isModuleUnlocked: (moduleId: number) => boolean;

  // Actions
  selectModule: (moduleId: number) => void;
  selectLesson: (lessonId: number, moduleId: number) => void; // Updated to include moduleId for context
  selectTask: (taskIndex: number) => void;
  setTaskCompletionStatus: (lessonId: number, taskIndex: number, status: boolean) => void;
  markTaskAsSolved: (lessonId: number, taskIndex: number) => void;
  setQuizFeedback: (feedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null) => void;
  setIsAILoading: (isLoading: boolean) => void;
  resetTaskStateForLesson: (lessonId: number) => void;
  // Could add more specific actions like goToNextTask, goToPrevTask later if needed
}

const useCourseStore = create<CourseState>((set, get) => ({
  selectedModuleId: course.modules[0]?.module_id || null,
  selectedLessonId: course.modules[0]?.lessons[0]?.lesson_id || null,
  selectedTaskIndex: 0,
  taskCompletionStatus: {},
  quizFeedback: null,
  isAILoading: false,
  courseData: course,

  // Selectors
  selectedModule: () => {
    const { selectedModuleId, courseData } = get();
    if (!selectedModuleId) return null;
    return courseData.modules.find(m => m.module_id === selectedModuleId) || null;
  },
  selectedLesson: () => {
    const { selectedLessonId } = get();
    const module = get().selectedModule();
    if (!selectedLessonId || !module) return null;
    return module.lessons.find(l => l.lesson_id === selectedLessonId) || null;
  },
  currentTask: () => {
    const { selectedTaskIndex } = get();
    const lesson = get().selectedLesson();
    return lesson?.tasks[selectedTaskIndex] || null;
  },
  currentTaskId: () => {
    const { selectedLessonId, selectedTaskIndex } = get();
    const task = get().currentTask();
    if (selectedLessonId === null || !task) return '';
    return getTaskId(selectedLessonId, selectedTaskIndex);
  },

  isTaskConsideredSolved: (lessonId: number, taskIndex: number): boolean => {
    const { taskCompletionStatus, courseData } = get();
    const taskId = getTaskId(lessonId, taskIndex);
    const task = courseData.modules
        .flatMap(m => m.lessons)
        .find(l => l.lesson_id === lessonId)
        ?.tasks[taskIndex];

    if (!task) return false;

    if (task.task_type === 'ads' || (task.task_type === 'html' && (task.action === 'lecture' || task.action === 'text'))) {
        return true; // These are considered solved on view. Actual marking will happen via an effect in the component.
    }
    return !!taskCompletionStatus[taskId];
  },

  isLessonComplete: (lessonId: number): boolean => {
    const { courseData, isTaskConsideredSolved } = get();
    const lesson = courseData.modules.flatMap(m => m.lessons).find(l => l.lesson_id === lessonId);
    if (!lesson) return false;
    return lesson.tasks.every((_, taskIndex) => isTaskConsideredSolved(lessonId, taskIndex));
  },

  isModuleComplete: (moduleId: number): boolean => {
    const { courseData, isLessonComplete } = get();
    const module = courseData.modules.find(m => m.module_id === moduleId);
    if (!module) return false;
    return module.lessons.every(lesson => isLessonComplete(lesson.lesson_id));
  },

  isLessonUnlocked: (lessonId: number, moduleId: number): boolean => {
    const { courseData, isModuleComplete, isLessonComplete } = get();
    const moduleIndex = courseData.modules.findIndex(m => m.module_id === moduleId);
    const currentModule = courseData.modules[moduleIndex];
    if (!currentModule) return false;
    const lessonIndex = currentModule.lessons.findIndex(l => l.lesson_id === lessonId);

    if (moduleIndex === 0 && lessonIndex === 0) return true;

    if (lessonIndex === 0) {
      if (moduleIndex === 0) return true;
      const prevModule = courseData.modules[moduleIndex - 1];
      return prevModule ? isModuleComplete(prevModule.module_id) : false;
    }

    const prevLesson = currentModule.lessons[lessonIndex - 1];
    return prevLesson ? isLessonComplete(prevLesson.lesson_id) : false;
  },

  isModuleUnlocked: (moduleId: number): boolean => {
    const { courseData, isModuleComplete } = get();
    const moduleIndex = courseData.modules.findIndex(m => m.module_id === moduleId);
    if (moduleIndex === 0) return true;
    const prevModule = courseData.modules[moduleIndex - 1];
    return prevModule ? isModuleComplete(prevModule.module_id) : false;
  },

  // Actions
  selectModule: (moduleId) => set(state => {
    const newModule = state.courseData.modules.find(m => m.module_id === moduleId);
    if (!newModule || !state.isModuleUnlocked(moduleId)) return {}; // Do nothing if module not found or locked

    // If selecting a new module, default to its first lesson if unlocked
    const firstLessonOfNewModule = newModule.lessons[0];
    if (firstLessonOfNewModule && state.isLessonUnlocked(firstLessonOfNewModule.lesson_id, moduleId)) {
      return {
        selectedModuleId: moduleId,
        selectedLessonId: firstLessonOfNewModule.lesson_id,
        selectedTaskIndex: 0,
        quizFeedback: null,
      };
    }
    // If first lesson isn't unlocked (should not happen if module is unlocked), or no lessons, just set module.
    // Or, if the current lesson is part of the newly selected module, keep it.
    if (state.selectedLesson()?.lesson_id && newModule.lessons.some(l => l.lesson_id === state.selectedLessonId)) {
         return { selectedModuleId: moduleId };
    }

    return { selectedModuleId: moduleId, selectedLessonId: null, selectedTaskIndex: 0, quizFeedback: null };
  }),

  selectLesson: (lessonId, moduleId) => set(state => {
    if (!state.isLessonUnlocked(lessonId, moduleId)) {
      // Optionally dispatch a toast notification here if integrated with a toast system
      console.warn("Attempted to select a locked lesson.");
      return {};
    }
    // Also update selectedModuleId in case lesson selection changes the module context
    return {
      selectedModuleId: moduleId,
      selectedLessonId: lessonId,
      selectedTaskIndex: 0,
      quizFeedback: null,
    };
  }),

  selectTask: (taskIndex) => set({ selectedTaskIndex: taskIndex, quizFeedback: null }),

  setTaskCompletionStatus: (lessonId, taskIndex, status) => set(state => {
    const taskId = getTaskId(lessonId, taskIndex);
    return {
      taskCompletionStatus: {
        ...state.taskCompletionStatus,
        [taskId]: status,
      },
    };
  }),

  markTaskAsSolved: (lessonId, taskIndex) => {
    const taskId = getTaskId(lessonId, taskIndex);
    set(state => ({
      taskCompletionStatus: { ...state.taskCompletionStatus, [taskId]: true }
    }));
  },

  setQuizFeedback: (feedback) => set({ quizFeedback: feedback }),
  setIsAILoading: (isLoading) => set({ isAILoading: isLoading }),

  resetTaskStateForLesson: (lessonId) => set(state => {
    // This is a placeholder. Depending on what "resetting task state" means,
    // you might need to clear specific quiz answers, code inputs etc.
    // For now, it clears quizFeedback. If tasks had their own state within the store, clear that too.
    if (state.selectedLessonId === lessonId) {
      return { quizFeedback: null };
    }
    return {};
  }),

}));

export default useCourseStore;

// Define types in a separate file, e.g., src/types/course.ts
// For now, I'll add them here for completeness of this file, then move them.

/*
export interface QuizAnswer {
  text: string;
  value: number;
}

export interface QuizQuestion {
  text: string;
  type: 'option' | 'blank' | 'blank_options' | string;
  answers: QuizAnswer[];
  answer: string;
  hint?: string;
  success?: string;
  failed?: string;
}

export interface BaseTaskMetadata {
  caption: string;
  difficulty: number;
  hint?: string;
  hints?: Array<{ cost?: number; text: string }>;
  tag?: string[];
  faqs?: string[];
  intro?: string;
  problem?: string;
}

export interface HtmlTaskMetadata extends BaseTaskMetadata {
  questions?: QuizQuestion[];
  multi_choice?: boolean;
  precode?: string;
  answer?: string;
}

export interface AdsTaskMetadata extends BaseTaskMetadata {
  video: string;
  video_source?: string;
}

export interface CodeEvent {
  caption: string;
  key: string;
}
export interface CodeTaskMetadata extends BaseTaskMetadata {
  precode: { [key: string]: string } | string;
  code_language?: string;
  language?: string;
  answer?: Array<{ [key: string]: string }>;
  solution?: { [key: string]: { [key: string]: string[] } };
  auto_verify?: boolean;
  verification_type?: string;
  drawing?: boolean;
  publish_web?: boolean;
  events?: CodeEvent[];
}

export interface BaseTypedTask<TType extends string, TMetadata extends BaseTaskMetadata> {
  task_type: TType;
  action?: 'lecture' | 'quiz' | 'text' | 'blank' | 'code_blank' | 'code';
  metadata: TMetadata;
}

export type HtmlTask = BaseTypedTask<'html', HtmlTaskMetadata>;
export type AdsTask = BaseTypedTask<'ads', AdsTaskMetadata>;
export type CodeTask = BaseTypedTask<'code', CodeTaskMetadata>;

export type Task = HtmlTask | AdsTask | CodeTask;

export interface Lesson {
  lesson_id: number;
  lesson_title: string;
  aim: string;
  description?: string;
  what_students_will_build?: string;
  concepts_learned?: string[];
  tasks: Task[];
}

export interface Module {
  module_id: number;
  module_title: string;
  aim?: string;
  description?: string;
  what_students_will_build?: string;
  concepts_learned?: string[];
  lessons: Lesson[];
}

export interface Course {
  course_name: string;
  age_group?: string;
  learning_goals?: string[];
  modules: Module[];
}
*/
// It's better to have these types in a dedicated `src/types/course.ts` file.
// I will create this file next.
