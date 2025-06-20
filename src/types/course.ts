// Type Definitions based on courseData.js and page.tsx

export interface QuizAnswer {
  text: string;
  value: number; // Can be number or string, ensure consistency or use `string | number`
}

export interface QuizQuestion {
  text: string;
  type: 'option' | 'blank' | 'blank_options' | string; // Allow for other types if any
  answers: QuizAnswer[];
  answer: string; // This seems to be the value of the correct QuizAnswer
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
  // update_difficulty?: boolean; // (From schema, consider if needed in frontend state)
}

export interface HtmlTaskMetadata extends BaseTaskMetadata {
  questions?: QuizQuestion[]; // For quiz type
  multi_choice?: boolean;     // For quiz type
  precode?: string;           // For blank type (e.g., "Hello {{}} world")
  answer?: string;            // For blank type (e.g., "{{answer}}")
  // type?: string; // This is on QuizQuestion, not directly on HtmlTaskMetadata for quizzes
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
  precode: { [key: string]: string } | string; // Object for language-specific, string for general
  code_language?: string; // Primary indicator of language (e.g., "python", "javascript")
  language?: string;      // Fallback or alternative, ensure consistent usage
  answer?: Array<{ [key: string]: string }>; // Expected answer code, language-keyed
  solution?: { [key: string]: { [key: string]: string[] } }; // For code_blank, language and blank-index keyed
  auto_verify?: boolean;
  verification_type?: string; // e.g., "output_match_simulation"
  drawing?: boolean;
  publish_web?: boolean;
  events?: CodeEvent[];
}

// Base Task Structure
export interface BaseTypedTask<TType extends string, TMetadata extends BaseTaskMetadata> {
  task_type: TType;
  // 'action' helps differentiate behavior within a task_type, e.g., html can be lecture or quiz
  action?: 'lecture' | 'quiz' | 'text' | 'blank' | 'code_blank' | 'code' | string; // Added string for flexibility
  metadata: TMetadata;
}

// Specific Task Types
export type HtmlTask = BaseTypedTask<'html', HtmlTaskMetadata>;
export type AdsTask = BaseTypedTask<'ads', AdsTaskMetadata>;
export type CodeTask = BaseTypedTask<'code', CodeTaskMetadata>;

// Union Type for any Task
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
