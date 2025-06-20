import { Course, Lesson, Module, Task } from '@/types/course';

// Reflecting the store's new structure for modules and lessons
interface StoreModule extends Omit<Module, 'lessons'> {
  lessons?: StoreLesson[];
  lessonsLoaded?: boolean;
}

interface StoreLesson extends Omit<Lesson, 'tasks'> {
  tasks?: Task[];
  tasksLoaded?: boolean;
}

// State structure that selectors will receive
export interface SelectorStateContext {
  modules: StoreModule[];
  taskCompletionStatus: { [key: string]: boolean };
  selectedModuleId?: number | null; // Optional, for selectors that need it
  selectedLessonId?: number | null; // Optional
  selectedTaskIndex?: number;      // Optional
}

const getTaskId = (lessonId: number, taskIndex: number) => `${lessonId}-${taskIndex}`;

export const isTaskConsideredSolved = (
  state: Pick<SelectorStateContext, 'modules' | 'taskCompletionStatus'>,
  lessonId: number,
  taskIndex: number
): boolean => {
  const taskId = getTaskId(lessonId, taskIndex);

  const moduleContainingLesson = state.modules.find(m => m.lessons?.some(l => l.lesson_id === lessonId));
  const lesson = moduleContainingLesson?.lessons?.find(l => l.lesson_id === lessonId);
  const task = lesson?.tasks?.[taskIndex];

  if (!task) return false; // Task not found or not loaded

  // Lecture or ads tasks are solved on view (assuming view implies tasks are loaded)
  if (task.task_type === 'ads' || (task.task_type === 'html' && (task.action === 'lecture' || task.action === 'text'))) {
    return true;
  }
  return !!state.taskCompletionStatus[taskId];
};

export const isLessonComplete = (
  state: Pick<SelectorStateContext, 'modules' | 'taskCompletionStatus'>,
  lessonId: number
): boolean => {
  const moduleContainingLesson = state.modules.find(m => m.lessons?.some(l => l.lesson_id === lessonId));
  const lesson = moduleContainingLesson?.lessons?.find(l => l.lesson_id === lessonId);

  if (!lesson || !lesson.tasksLoaded || !lesson.tasks || lesson.tasks.length === 0) {
    return false; // Lesson not found, tasks not loaded, or no tasks
  }
  return lesson.tasks.every((_, taskIndex) => isTaskConsideredSolved(state, lessonId, taskIndex));
};

export const isModuleComplete = (
  state: Pick<SelectorStateContext, 'modules' | 'taskCompletionStatus'>,
  moduleId: number
): boolean => {
  const module = state.modules.find(m => m.module_id === moduleId);
  if (!module || !module.lessonsLoaded || !module.lessons || module.lessons.length === 0) {
    return false; // Module not found, lessons not loaded, or no lessons
  }
  return module.lessons.every(lesson => isLessonComplete(state, lesson.lesson_id));
};

export const isLessonUnlocked = (
  state: Pick<SelectorStateContext, 'modules' | 'taskCompletionStatus'>,
  lessonId: number,
  moduleId: number
): boolean => {
  const moduleIndex = state.modules.findIndex(m => m.module_id === moduleId);
  const currentModule = state.modules[moduleIndex];
  if (!currentModule) return false; // Module itself not found in state

  // Find the lesson within the current module, even if lessons aren't fully loaded yet,
  // we might have its basic info if module structure is known.
  // This selector primarily depends on the completion of *previous* lessons/modules.
  const lessonIndex = currentModule.lessons?.findIndex(l => l.lesson_id === lessonId) ?? -1;

  if (moduleIndex === 0 && lessonIndex === 0) return true; // First lesson of first module

  if (lessonIndex === 0) { // First lesson of a module (other than the very first module)
    if (moduleIndex === 0) return true; // Should be covered by above
    const prevModule = state.modules[moduleIndex - 1];
    return prevModule ? isModuleComplete(state, prevModule.module_id) : false;
  }

  // Not the first lesson in this module
  const prevLesson = currentModule.lessons?.[lessonIndex - 1];
  return prevLesson ? isLessonComplete(state, prevLesson.lesson_id) : false;
};

export const isModuleUnlocked = (
  state: Pick<SelectorStateContext, 'modules' | 'taskCompletionStatus'>,
  moduleId: number
): boolean => {
  const moduleIndex = state.modules.findIndex(m => m.module_id === moduleId);
  if (moduleIndex === 0) return true; // First module is always unlocked
  if (moduleIndex < 0) return false; // Module not found
  const prevModule = state.modules[moduleIndex - 1];
  return prevModule ? isModuleComplete(state, prevModule.module_id) : false;
};


// --- Selectors for current items ---
// These need the selected IDs from the state.

export const getSelectedModule = (state: SelectorStateContext): StoreModule | null => {
  if (!state.selectedModuleId) return null;
  return state.modules.find(m => m.module_id === state.selectedModuleId) || null;
};

export const getSelectedLesson = (state: SelectorStateContext): StoreLesson | null => {
  const module = getSelectedModule(state);
  if (!state.selectedLessonId || !module || !module.lessonsLoaded) return null;
  return module.lessons?.find(l => l.lesson_id === state.selectedLessonId) || null;
};

export const getCurrentTask = (state: SelectorStateContext): Task | null => {
  const lesson = getSelectedLesson(state);
  if (!lesson || !lesson.tasksLoaded || typeof state.selectedTaskIndex !== 'number') return null;
  return lesson.tasks?.[state.selectedTaskIndex] || null;
};

export const getCurrentTaskId = (state: SelectorStateContext): string => {
  const task = getCurrentTask(state);
  if (state.selectedLessonId === null || !task || typeof state.selectedTaskIndex !== 'number') return '';
  return getTaskId(state.selectedLessonId, state.selectedTaskIndex);
};

// Helper to get the raw course data in the original Course shape, if fully loaded.
// This is for parts of the app that might expect the full Course structure.
// Use with caution, check loading flags first.
export const getFullCourseDataShape = (state: SelectorStateContext & Pick<CourseState, 'courseName'|'ageGroup'|'learningGoals'>): Course | null => {
    const allModulesLoaded = state.modules.every(m =>
        m.lessonsLoaded && m.lessons?.every(l => l.tasksLoaded)
    );
    if (!state.courseName || !allModulesLoaded) {
        // console.warn("Attempted to get full course data shape, but not all data is loaded.");
        // return null; // Or return partial data
    }

    return {
        course_name: state.courseName || "",
        age_group: state.ageGroup || "",
        learning_goals: state.learningGoals || [],
        modules: state.modules.map(sm => ({
            ...sm,
            lessons: (sm.lessons || []).map(sl => ({
                ...sl,
                tasks: sl.tasks || []
            }))
        })) as Module[] // Cast to full Module type, assuming data is there if allLoaded
    };
};
