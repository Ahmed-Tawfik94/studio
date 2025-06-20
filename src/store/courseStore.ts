import { create } from 'zustand/vanilla';
import { Course, Module, Lesson, Task, QuizQuestion, QuizAnswer } from '@/types/course';
import * as Selectors from './courseSelectors'; // Assuming courseSelectors.ts is adjusted or used carefully

// Helper
const getTaskId = (lessonId: number, taskIndex: number) => `${lessonId}-${taskIndex}`;

// Define a more granular structure for modules and lessons in the store
// to reflect that they might be partially loaded.
interface StoreModule extends Omit<Module, 'lessons'> {
  lessons?: StoreLesson[]; // Lessons can be undefined or partially loaded
  lessonsLoaded?: boolean;
}

interface StoreLesson extends Omit<Lesson, 'tasks'> {
  tasks?: Task[]; // Tasks can be undefined or partially loaded
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
  isAILoading: boolean; // For AI hint generation

  // Loading states for async data
  isLoadingCourseMeta: boolean;
  isLoadingModuleLessons: number | null; // moduleId of module being loaded
  isLoadingLessonTasks: number | null; // lessonId of lesson tasks being loaded

  // Actions
  _setCourseData: (data: Partial<Pick<Course, 'course_name' | 'age_group' | 'learning_goals' | 'modules'>>) => void;
  fetchCourseMeta: () => Promise<void>;
  fetchModuleLessons: (moduleId: number) => Promise<void>;
  fetchLessonTasks: (lessonId: number, moduleId: number) => Promise<void>; // moduleId to find the lesson

  selectModule: (moduleId: number) => void;
  selectLesson: (lessonId: number, moduleId: number) => void;
  selectTask: (taskIndex: number) => void;
  setTaskCompletionStatus: (lessonId: number, taskIndex: number, status: boolean) => void;
  markTaskAsSolved: (lessonId: number, taskIndex: number) => void;
  setQuizFeedback: (feedback: { question: string; studentAnswer: string; rewrittenQuestion: string | null } | null) => void;
  setIsAILoading: (isLoading: boolean) => void;
}

const useCourseStore = create<CourseState>((set, get) => ({
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

  _setCourseData: (data) => set(state => ({
    courseName: data.course_name ?? state.courseName,
    ageGroup: data.age_group ?? state.ageGroup,
    learningGoals: data.learning_goals ?? state.learningGoals,
    modules: data.modules ? data.modules.map(m => ({ ...m, lessonsLoaded: false })) : state.modules,
    // Select first module and lesson if available after setting data
    selectedModuleId: data.modules && data.modules.length > 0 ? data.modules[0].module_id : null,
    // selectedLessonId will be set when module lessons are loaded or explicitly selected
  })),

  fetchCourseMeta: async () => {
    if (get().isLoadingCourseMeta || get().courseName) return; // Already loaded or loading
    set({ isLoadingCourseMeta: true });
    try {
      const response = await fetch('/course-meta.json'); // Ensure this file exists in /public
      if (!response.ok) throw new Error(`Failed to fetch course-meta.json: ${response.statusText}`);
      const meta: Pick<Course, 'course_name' | 'age_group' | 'learning_goals' | 'modules'> = await response.json();

      const modulesWithBasicInfo: StoreModule[] = meta.modules.map(m => ({
        ...m, // module_id, module_title, aim, description
        lessons: [], // Initialize with empty lessons array
        lessonsLoaded: false,
      }));

      set({
        courseName: meta.course_name,
        ageGroup: meta.age_group,
        learningGoals: meta.learning_goals,
        modules: modulesWithBasicInfo,
        selectedModuleId: modulesWithBasicInfo[0]?.module_id || null,
        // Do not select lesson yet, lessons need to be fetched for the first module
        selectedLessonId: null,
        selectedTaskIndex: 0,
        isLoadingCourseMeta: false,
      });
      // After loading meta, if there's a selected module, fetch its lessons
      const firstModuleId = modulesWithBasicInfo[0]?.module_id;
      if (firstModuleId) {
        get().fetchModuleLessons(firstModuleId);
      }

    } catch (error) {
      console.error("Failed to load course metadata:", error);
      set({ isLoadingCourseMeta: false });
    }
  },

  fetchModuleLessons: async (moduleId) => {
    const currentModule = get().modules.find(m => m.module_id === moduleId);
    if (!currentModule || currentModule.lessonsLoaded || get().isLoadingModuleLessons === moduleId) {
      return; // Already loaded, loading, or module not found
    }
    set({ isLoadingModuleLessons: moduleId });
    try {
      const response = await fetch(`/modules/module-${moduleId}-lessons.json`); // e.g., /public/modules/module-1-lessons.json
      if (!response.ok) throw new Error(`Failed to fetch lessons for module ${moduleId}: ${response.statusText}`);
      const lessons: Omit<Lesson, 'tasks'>[] = await response.json(); // Lessons without full tasks initially

      const lessonsWithBasicTasks: StoreLesson[] = lessons.map(l => ({
        ...l,
        tasks: [], // Initialize with empty tasks or just task IDs/titles if your JSON provides that
        tasksLoaded: false,
      }));

      set(state => ({
        modules: state.modules.map(m =>
          m.module_id === moduleId ? { ...m, lessons: lessonsWithBasicTasks, lessonsLoaded: true } : m
        ),
        isLoadingModuleLessons: null,
        // If this is the currently selected module and no lesson is selected, select the first one
        selectedLessonId: state.selectedModuleId === moduleId && lessonsWithBasicTasks.length > 0 ? lessonsWithBasicTasks[0].lesson_id : state.selectedLessonId,
        selectedTaskIndex: state.selectedModuleId === moduleId && lessonsWithBasicTasks.length > 0 ? 0 : state.selectedTaskIndex,
      }));

      // If a lesson was just selected, fetch its tasks
      const newlySelectedLessonId = get().selectedLessonId;
      if (get().selectedModuleId === moduleId && newlySelectedLessonId && lessonsWithBasicTasks.some(l=>l.lesson_id === newlySelectedLessonId)) {
          const lessonToLoadTasks = lessonsWithBasicTasks.find(l=>l.lesson_id === newlySelectedLessonId);
          if (lessonToLoadTasks && !lessonToLoadTasks.tasksLoaded){
               get().fetchLessonTasks(newlySelectedLessonId, moduleId);
          }
      }

    } catch (error) {
      console.error(`Failed to load lessons for module ${moduleId}:`, error);
      set({ isLoadingModuleLessons: null });
    }
  },

  fetchLessonTasks: async (lessonId, moduleId) => {
    const module = get().modules.find(m => m.module_id === moduleId);
    const lesson = module?.lessons?.find(l => l.lesson_id === lessonId);
    if (!lesson || lesson.tasksLoaded || get().isLoadingLessonTasks === lessonId) {
      return; // Already loaded, loading, or lesson not found
    }
    set({ isLoadingLessonTasks: lessonId });
    try {
      const response = await fetch(`/lessons/lesson-${lessonId}-tasks.json`); // e.g., /public/lessons/lesson-1.1-tasks.json
      if (!response.ok) throw new Error(`Failed to fetch tasks for lesson ${lessonId}: ${response.statusText}`);
      const tasks: Task[] = await response.json();

      set(state => ({
        modules: state.modules.map(m =>
          m.module_id === moduleId
            ? {
                ...m,
                lessons: m.lessons?.map(l =>
                  l.lesson_id === lessonId ? { ...l, tasks: tasks, tasksLoaded: true } : l
                ),
              }
            : m
        ),
        isLoadingLessonTasks: null,
      }));
    } catch (error) {
      console.error(`Failed to load tasks for lesson ${lessonId}:`, error);
      set({ isLoadingLessonTasks: null });
    }
  },

  selectModule: (moduleId) => {
    const currentModule = get().modules.find(m => m.module_id === moduleId);
    const moduleIsUnlocked = Selectors.isModuleUnlocked(
        { courseData: { modules: get().modules } as Course, taskCompletionStatus: get().taskCompletionStatus }, // Cast needed due to partial state for selector
        moduleId
    );

    if (!currentModule || !moduleIsUnlocked) {
        // Potentially show toast here via a separate toast utility if actions shouldn't directly use UI
        console.warn("Module locked or not found");
        return;
    }

    set({ selectedModuleId: moduleId, selectedLessonId: null, selectedTaskIndex: 0, quizFeedback: null });

    if (!currentModule.lessonsLoaded) {
      get().fetchModuleLessons(moduleId);
    } else if (currentModule.lessons && currentModule.lessons.length > 0) {
      // If lessons are loaded, select the first lesson and fetch its tasks if not loaded
      const firstLesson = currentModule.lessons[0];
      set({ selectedLessonId: firstLesson.lesson_id, selectedTaskIndex: 0 });
      if (!firstLesson.tasksLoaded) {
        get().fetchLessonTasks(firstLesson.lesson_id, moduleId);
      }
    }
  },

  selectLesson: (lessonId, moduleId) => {
    const module = get().modules.find(m => m.module_id === moduleId);
    const lesson = module?.lessons?.find(l => l.lesson_id === lessonId);

    const lessonIsUnlocked = Selectors.isLessonUnlocked(
         { courseData: { modules: get().modules } as Course, taskCompletionStatus: get().taskCompletionStatus },
        lessonId,
        moduleId
    );

    if (!lesson || !lessonIsUnlocked) {
      console.warn("Lesson locked or not found");
      return;
    }

    set({ selectedLessonId: lessonId, selectedModuleId: moduleId, selectedTaskIndex: 0, quizFeedback: null });

    if (!lesson.tasksLoaded) {
      get().fetchLessonTasks(lessonId, moduleId);
    }
  },

  selectTask: (taskIndex) => set({ selectedTaskIndex: taskIndex, quizFeedback: null }),

  setTaskCompletionStatus: (lessonId, taskIndex, status) => set(state => {
    const taskId = getTaskId(lessonId, taskIndex);
    return { taskCompletionStatus: { ...state.taskCompletionStatus, [taskId]: status } };
  }),

  markTaskAsSolved: (lessonId, taskIndex) => {
    const taskId = getTaskId(lessonId, taskIndex);
    set(state => ({ taskCompletionStatus: { ...state.taskCompletionStatus, [taskId]: true } }));
  },

  setQuizFeedback: (feedback) => set({ quizFeedback: feedback }),
  setIsAILoading: (isLoading) => set({ isAILoading: isLoading }),
}));

export default useCourseStore;

// The selectors in `courseSelectors.ts` will also need to be updated
// to work with the new `StoreModule` and `StoreLesson` types,
// especially checking for `lessonsLoaded` and `tasksLoaded` flags
// and potentially handling undefined `lessons` or `tasks` arrays.
// For example, `isLessonComplete` might need to check if tasks are loaded first.
// MinimalCourseStateForSelectors should also be updated.
// For now, I've made a temporary cast for `courseData` when calling selectors from actions.
// This will need careful review.
// The `courseData` field in the store might need a more specific type like `Partial<Course>`
// or a dedicated type reflecting the progressively loaded structure.
// For now, I've kept `courseData` as `Course` in the interface but it's effectively partial.
// The actions now use `modules: StoreModule[]` from the state.
// The selectors will need to be passed `{ modules: state.modules, taskCompletionStatus: state.taskCompletionStatus }`
// and their internal `courseData` parameter should expect this shape.
// I've updated `selectModule` and `selectLesson` to use the external selectors, but the casting is a temporary measure.
// The `courseSelectors.ts` file will need significant updates to match this new store structure.

// The current `MinimalCourseStateForSelectors` in `courseSelectors.ts` is:
// export interface MinimalCourseStateForSelectors {
//   courseData: Course; // This needs to change to something like { modules: StoreModule[] }
//   taskCompletionStatus: { [key: string]: boolean };
// }
// This will be the next file to update.
