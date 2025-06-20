"use client";

import React, { useEffect } from 'react';
import useCourseStore from '@/store/courseStore'; // Adjust path
import CourseSidebar from '@/components/layout/CourseSidebar'; // Adjust path
import MainContentArea from '@/components/layout/MainContentArea'; // Adjust path
// Types might not be needed directly here anymore if components handle their own data fetching from store

function CoursePilotApp() {
  const fetchCourseMeta = useCourseStore(state => state.fetchCourseMeta);
  const courseName = useCourseStore(state => state.courseName);
  const isLoadingCourseMeta = useCourseStore(state => state.isLoadingCourseMeta);
  const modules = useCourseStore(state => state.modules);

  useEffect(() => {
    fetchCourseMeta();
  }, [fetchCourseMeta]);

  if (isLoadingCourseMeta && !courseName) {
    return (
      <div className="flex h-screen bg-background text-foreground items-center justify-center">
        <div>Loading Course Information...</div> {/* Replace with a proper loader/skeleton */}
      </div>
    );
  }
  
  if (!courseName && !isLoadingCourseMeta && modules.length === 0) {
    return (
       <div className="flex h-screen bg-background text-foreground items-center justify-center">
        <div>Failed to load course. Please try refreshing.</div>
      </div>
    )
  }


  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Pass courseName directly, or let CourseSidebar fetch it if preferred */}
      <CourseSidebar courseName={courseName || "Loading..."} />
      <MainContentArea />
    </div>
  );
}

export default function CoursePilotPage() {
  // This component itself is a server component by default in App Router.
  // To use hooks like useEffect, CoursePilotApp needs to be a client component,
  // or this page needs to be marked "use client" if CoursePilotApp is directly exported.
  // Assuming CoursePilotApp is intended to be a client component as it uses hooks.
  return <CoursePilotApp />;
}
