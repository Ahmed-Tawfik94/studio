"use client";

import React from 'react';
import useCourseStore from '@/store/courseStore'; // Adjust path
import CourseSidebar from '@/components/layout/CourseSidebar'; // Adjust path
import MainContentArea from '@/components/layout/MainContentArea'; // Adjust path
import { Course, Lesson, Task, QuizQuestion, QuizAnswer } // Assuming these types are now in @/types/course
from '@/types/course'; // Adjust path

// The main app component, now much leaner
function CoursePilotApp() {
  // Fetch initial static data or data that doesn't change often directly from store if needed
  // For example, the course name.
  const courseName = useCourseStore(state => state.courseData.course_name);
  
  // Most of the state and logic is now within individual components or the Zustand store.
  // MainContentArea and CourseSidebar will subscribe to the store for their respective needs.

  // Example of how one might still need top-level state or effects,
  // though in this refactor, most has been pushed down or into the store.
  // useEffect(() => {
  //   // Perform any initial setup that might depend on store being ready,
  //   // or dispatch initial actions if not handled in store initialization.
  //   // For instance, loading course data if it were async:
  //   // useCourseStore.getState().loadCourseData();
  // }, []);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <CourseSidebar courseName={courseName} />
      <MainContentArea /> {/* MainContentArea now fetches its own data from the store */}
    </div>
  );
}

// The page component that renders the main application
export default function CoursePilotPage() {
  return <CoursePilotApp />;
}
