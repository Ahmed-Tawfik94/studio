import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { Course, Module, Lesson, Task, QuizQuestion, QuizAnswer } from '@/types/course';
// Removed: import * as Selectors from './courseSelectors';

// Helper
const getTaskId = (lessonId: number, taskIndex: number) => `${lessonId}-${taskIndex}`;

// Define a more granular structure for modules and lessons in the store
interface StoreModule extends Omit<Module, 'lessons'> {
  lessons?: StoreLesson[];
  lessonsLoaded?: boolean;
}

interface StoreLesson extends Omit<Lesson, 'tasks'> {
  tasks?: Task[];
  tasksLoaded?: boolean;
}

export interface CourseState {
  courseName: string | null;
  ageGroup: string | null;
  learningGoals: string[] | null;
  modules: StoreModule[];

  selectedModuleId: number | null;
  selectedLessonId: number | null;
  selectedTaskIndex: number;

  taskCompletionStatus: { [key: string]: boolean };
  quizFeedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null;
  isAILoading: boolean;

  // Loading states for async data
  isLoadingCourseMeta: boolean;
  isLoadingModuleLessons: number | null; // Stores moduleId
  isLoadingLessonTasks: number | null; // Stores lessonId

  // Actions
  _setCourseData: (data: Partial<Pick<Course, 'course_name' | 'age_group' | 'learning_goals' | 'modules'>>) => void;
  fetchCourseMeta: () => Promise<void>;
  fetchModuleLessons: (moduleId: number) => Promise<void>;
  fetchLessonTasks: (lessonId: number, moduleId: number) => Promise<void>;

  selectModule: (moduleId: number) => void;
  selectLesson: (lessonId: number, moduleId: number) => void;
  selectTask: (taskIndex: number) => void;
  setTaskCompletionStatus: (lessonId: number, taskIndex: number, status: boolean) => void;
  markTaskAsSolved: (lessonId: number, taskIndex: number) => void;
  setQuizFeedback: (feedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null) => void;
  setIsAILoading: (isLoading: boolean) => void;
}

const useCourseStore = create<CourseState>()(
  subscribeWithSelector((set, get) => ({
    courseName: null,
    ageGroup: null,
    learningGoals: null,
    modules: [],

    selectedModuleId: null,
    selectedLessonId: null,
    selectedTaskIndex: 0,

    taskCompletionStatus: {},
    quizFeedback: null,
    isAILoading: false,

    isLoadingCourseMeta: false,
    isLoadingModuleLessons: null,
    isLoadingLessonTasks: null,

    _setCourseData: (data) => set(state => {
      const newModules = data.modules ? data.modules.map(m => ({ ...m, lessonsLoaded: false, lessons: m.lessons || [] })) : state.modules;
      return {
        courseName: data.course_name ?? state.courseName,
        ageGroup: data.age_group ?? state.ageGroup,
        learningGoals: data.learning_goals ?? state.learningGoals,
        modules: newModules,
        selectedModuleId: data.modules && data.modules.length > 0 ? data.modules[0].module_id : state.selectedModuleId,
      };
    }),

    fetchCourseMeta: async () => {
      const state = get();
      if (state.isLoadingCourseMeta || state.courseName) return;
      set({ isLoadingCourseMeta: true });
      try {
        const response = await fetch('/course-meta.json');
        if (!response.ok) throw new Error(`Failed to fetch course-meta.json: ${response.statusText}`);
        const meta: Pick<Course, 'course_name' | 'age_group' | 'learning_goals' | 'modules'> = await response.json();
        const modulesWithBasicInfo: StoreModule[] = meta.modules.map(m => ({
          ...m, lessons: [], lessonsLoaded: false,
        }));
        set({
          courseName: meta.course_name, ageGroup: meta.age_group, learningGoals: meta.learning_goals,
          modules: modulesWithBasicInfo,
          selectedModuleId: modulesWithBasicInfo[0]?.module_id || null,
          selectedLessonId: null, selectedTaskIndex: 0, isLoadingCourseMeta: false,
        });
        const firstModuleId = modulesWithBasicInfo[0]?.module_id;
        if (firstModuleId) get().fetchModuleLessons(firstModuleId);
      } catch (error) {
        console.error("Failed to load course metadata:", error);
        set({ isLoadingCourseMeta: false });
      }
    },

    fetchModuleLessons: async (moduleId) => {
      const state = get();
      const currentModule = state.modules.find(m => m.module_id === moduleId);
      if (!currentModule || currentModule.lessonsLoaded || state.isLoadingModuleLessons === moduleId) return;
      set({ isLoadingModuleLessons: moduleId });
      try {
        const response = await fetch(`/modules/module-${moduleId}-lessons.json`);
        if (!response.ok) throw new Error(`Failed to fetch lessons for module ${moduleId}: ${response.statusText}`);
        const lessons: Omit<Lesson, 'tasks'>[] = await response.json();
        const lessonsWithBasicTasks: StoreLesson[] = lessons.map(l => ({ ...l, tasks: [], tasksLoaded: false }));

        set(s => {
          const updatedModules = s.modules.map(m => m.module_id === moduleId ? { ...m, lessons: lessonsWithBasicTasks, lessonsLoaded: true } : m);
          const thisModule = updatedModules.find(m => m.module_id === moduleId);
          let shouldSelectFirstLesson = false;
          let firstLessonIdForSelection: number | null = null;

          if (s.selectedModuleId === moduleId && thisModule && thisModule.lessons && thisModule.lessons.length > 0) {
            const firstLesson = thisModule.lessons[0];
            // Use internal courseSelectors here
            if (courseSelectors.isLessonUnlocked(s, firstLesson.lesson_id, moduleId)) {
              shouldSelectFirstLesson = true;
              firstLessonIdForSelection = firstLesson.lesson_id;
            }
          }

          return {
            modules: updatedModules, isLoadingModuleLessons: null,
            selectedLessonId: shouldSelectFirstLesson ? firstLessonIdForSelection : s.selectedLessonId,
            selectedTaskIndex: shouldSelectFirstLesson ? 0 : s.selectedTaskIndex,
          };
        });

        const newState = get();
        if (newState.selectedModuleId === moduleId && newState.selectedLessonId) {
            const selectedLessonObj = newState.modules.find(m => m.module_id === moduleId)?.lessons?.find(l => l.lesson_id === newState.selectedLessonId);
            if (selectedLessonObj && !selectedLessonObj.tasksLoaded) {
                 get().fetchLessonTasks(newState.selectedLessonId, moduleId);
            }
        }

      } catch (error) {
        console.error(`Failed to load lessons for module ${moduleId}:`, error);
        set({ isLoadingModuleLessons: null });
      }
    },

    fetchLessonTasks: async (lessonId, moduleId) => {
      const state = get();
      const module = state.modules.find(m => m.module_id === moduleId);
      const lesson = module?.lessons?.find(l => l.lesson_id === lessonId);
      if (!lesson || lesson.tasksLoaded || state.isLoadingLessonTasks === lessonId) return;
      set({ isLoadingLessonTasks: lessonId });
      try {
        const response = await fetch(`/lessons/lesson-${lessonId}-tasks.json`);
        if (!response.ok) throw new Error(`Failed to fetch tasks for lesson ${lessonId}: ${response.statusText}`);
        const tasks: Task[] = await response.json();
        set(s => ({
          modules: s.modules.map(m => m.module_id === moduleId ? { ...m, lessons: m.lessons?.map(l => l.lesson_id === lessonId ? { ...l, tasks: tasks, tasksLoaded: true } : l) } : m),
          isLoadingLessonTasks: null,
        }));
      } catch (error) {
        console.error(`Failed to load tasks for lesson ${lessonId}:`, error);
        set({ isLoadingLessonTasks: null });
      }
    },

    selectModule: (moduleId) => {
      const state = get();
      const currentModule = state.modules.find(m => m.module_id === moduleId);

      if (!currentModule || !courseSelectors.isModuleUnlocked(state, moduleId)) { // Use internal selector
        console.warn("Module locked or not found", moduleId);
        return;
      }

      set({ selectedModuleId: moduleId, selectedLessonId: null, selectedTaskIndex: 0, quizFeedback: null });

      if (!currentModule.lessonsLoaded) {
        get().fetchModuleLessons(moduleId);
      } else if (currentModule.lessons && currentModule.lessons.length > 0) {
        const firstLesson = currentModule.lessons[0];
        if (courseSelectors.isLessonUnlocked(state, firstLesson.lesson_id, moduleId)) { // Use internal selector
          set({ selectedLessonId: firstLesson.lesson_id, selectedTaskIndex: 0 });
          if (!firstLesson.tasksLoaded && firstLesson.lesson_id !== null) {
            get().fetchLessonTasks(firstLesson.lesson_id, moduleId);
          }
        }
      }
    },

    selectLesson: (lessonId, moduleId) => {
      const state = get();
      const module = state.modules.find(m => m.module_id === moduleId);
      const lesson = module?.lessons?.find(l => l.lesson_id === lessonId);

      if (!lesson || !courseSelectors.isLessonUnlocked(state, lessonId, moduleId)) { // Use internal selector
        console.warn("Lesson locked or not found", lessonId);
        return;
      }
      set({ selectedLessonId: lessonId, selectedModuleId: moduleId, selectedTaskIndex: 0, quizFeedback: null });
      if (!lesson.tasksLoaded) {
        get().fetchLessonTasks(lessonId, moduleId);
      }
    },

    selectTask: (taskIndex) => set({ selectedTaskIndex: taskIndex, quizFeedback: null }),
    setTaskCompletionStatus: (lessonId, taskIndex, status) => {
      const taskId = getTaskId(lessonId, taskIndex);
      set(s => ({ taskCompletionStatus: { ...s.taskCompletionStatus, [taskId]: status } }));
    },
    markTaskAsSolved: (lessonId, taskIndex) => {
      const taskId = getTaskId(lessonId, taskIndex);
      set(s => ({ taskCompletionStatus: { ...s.taskCompletionStatus, [taskId]: true } }));
    },
    setQuizFeedback: (feedback) => set({ quizFeedback: feedback }),
    setIsAILoading: (isLoading) => set({ isAILoading: isLoading }),
  }))
);

export const courseSelectors = {
  courseName: (state: CourseState) => state.courseName,
  ageGroup: (state: CourseState) => state.ageGroup,
  learningGoals: (state: CourseState) => state.learningGoals,
  modules: (state: CourseState) => state.modules,
  selectedModuleId: (state: CourseState) => state.selectedModuleId,
  selectedLessonId: (state: CourseState) => state.selectedLessonId,
  selectedTaskIndex: (state: CourseState) => state.selectedTaskIndex,
  taskCompletionStatus: (state: CourseState) => state.taskCompletionStatus,
  quizFeedback: (state: CourseState) => state.quizFeedback,
  isAILoading: (state: CourseState) => state.isAILoading,
  isLoadingCourseMeta: (state: CourseState) => state.isLoadingCourseMeta,
  isLoadingModuleLessons: (state: CourseState) => state.isLoadingModuleLessons,
  isLoadingLessonTasks: (state: CourseState) => state.isLoadingLessonTasks,

  selectedModule: (state: CourseState): StoreModule | null =>
    state.selectedModuleId ? state.modules.find(m => m.module_id === state.selectedModuleId) || null : null,

  selectedLesson: (state: CourseState): StoreLesson | null => {
    const currentModule = courseSelectors.selectedModule(state);
    return state.selectedLessonId && currentModule?.lessonsLoaded && currentModule.lessons
      ? currentModule.lessons.find(l => l.lesson_id === state.selectedLessonId) || null
      : null;
  },

  currentTask: (state: CourseState): Task | null => {
    const currentLesson = courseSelectors.selectedLesson(state);
    return currentLesson?.tasksLoaded && currentLesson.tasks && typeof state.selectedTaskIndex === 'number'
      ? currentLesson.tasks[state.selectedTaskIndex] || null
      : null;
  },

  currentTaskId: (state: CourseState): string => {
    const task = courseSelectors.currentTask(state);
    if (state.selectedLessonId === null || !task || typeof state.selectedTaskIndex !== 'number') return '';
    return getTaskId(state.selectedLessonId, state.selectedTaskIndex);
  },

  isTaskConsideredSolved: (state: CourseState, lessonId: number, taskIndex: number): boolean => {
    const taskId = getTaskId(lessonId, taskIndex);
    const moduleForLesson = state.modules.find(m => m.lessons?.some(l => l.lesson_id === lessonId));
    const lesson = moduleForLesson?.lessons?.find(l => l.lesson_id === lessonId);
    if (!lesson || !lesson.tasksLoaded) return false;
    const task = lesson.tasks?.[taskIndex];
    if (!task) return false;
    if (task.task_type === 'ads' || (task.task_type === 'html' && (task.action === 'lecture' || task.action === 'text'))) {
      return true;
    }
    return !!state.taskCompletionStatus[taskId];
  },

  isLessonComplete: (state: CourseState, lessonId: number): boolean => {
    const moduleForLesson = state.modules.find(m => m.lessons?.some(l => l.lesson_id === lessonId));
    const lesson = moduleForLesson?.lessons?.find(l => l.lesson_id === lessonId);
    if (!lesson || !lesson.tasksLoaded || !lesson.tasks || lesson.tasks.length === 0) return false;
    return lesson.tasks.every((_, taskIdx) => courseSelectors.isTaskConsideredSolved(state, lessonId, taskIdx));
  },

  isModuleComplete: (state: CourseState, moduleId: number): boolean => {
    const module = state.modules.find(m => m.module_id === moduleId);
    if (!module || !module.lessonsLoaded || !module.lessons || module.lessons.length === 0) return false;
    return module.lessons.every(lesson => courseSelectors.isLessonComplete(state, lesson.lesson_id));
  },

  isLessonUnlocked: (state: CourseState, lessonId: number, moduleId: number): boolean => {
    const moduleIndex = state.modules.findIndex(m => m.module_id === moduleId);
    const currentModule = state.modules[moduleIndex];
    if (!currentModule) return false;

    const lessonIndex = currentModule.lessons?.findIndex(l => l.lesson_id === lessonId) ?? -1;

    if (moduleIndex === 0 && lessonIndex === 0) return true;

    if (lessonIndex === 0) {
      if (moduleIndex === 0) return true;
      const prevModule = state.modules[moduleIndex - 1];
      return prevModule && prevModule.lessonsLoaded ? courseSelectors.isModuleComplete(state, prevModule.module_id) : false;
    }

    if (lessonIndex < 0 && currentModule.lessonsLoaded) return false; // Lesson not in a loaded list
    if (lessonIndex < 0 && !currentModule.lessonsLoaded) return false; // Lessons not loaded, can't determine for non-first lesson

    const prevLesson = currentModule.lessons?.[lessonIndex - 1];
    return prevLesson && prevLesson.tasksLoaded ? courseSelectors.isLessonComplete(state, prevLesson.lesson_id) : false;
  },

  isModuleUnlocked: (state: CourseState, moduleId: number): boolean => {
    const moduleIndex = state.modules.findIndex(m => m.module_id === moduleId);
    if (moduleIndex === 0) return true;
    if (moduleIndex < 0) return false;
    const prevModule = state.modules[moduleIndex - 1];
    return prevModule && prevModule.lessonsLoaded ? courseSelectors.isModuleComplete(state, prevModule.module_id) : false;
  },

  selectionState: (state: CourseState) => ({
    moduleId: state.selectedModuleId,
    lessonId: state.selectedLessonId,
    taskIndex: state.selectedTaskIndex,
  }),

  loadingState: (state: CourseState) => ({
    courseMeta: state.isLoadingCourseMeta,
    moduleLessons: state.isLoadingModuleLessons,
    lessonTasks: state.isLoadingLessonTasks,
  }),
};

export const useCourseStoreShallow = <T>(selector: (state: CourseState) => T) => {
  return useCourseStore(selector, shallow);
};

export default useCourseStore;
