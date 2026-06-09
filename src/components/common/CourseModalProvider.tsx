import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Course } from '../../types/course';
import type { CourseIndex } from '../../utils/courseIndex';
import { CourseModal } from './CourseModal';

interface CourseModalContextValue {
  openCourse: (courseRef: string | Course) => void;
  closeCourse: () => void;
}

const CourseModalContext = createContext<CourseModalContextValue | null>(null);

export function CourseModalProvider({
  children,
  courseIndex,
}: {
  children: ReactNode;
  courseIndex: CourseIndex;
}) {
  const [course, setCourse] = useState<Course | null>(null);

  const openCourse = useCallback(
    (courseRef: string | Course) => {
      if (typeof courseRef === 'string') {
        setCourse(courseIndex.findCourse(courseRef) || null);
        return;
      }
      setCourse(courseRef);
    },
    [courseIndex],
  );

  const closeCourse = useCallback(() => setCourse(null), []);

  const value = useMemo(() => ({ openCourse, closeCourse }), [closeCourse, openCourse]);

  return (
    <CourseModalContext.Provider value={value}>
      {children}
      <CourseModal course={course} onClose={closeCourse} courseIndex={courseIndex} />
    </CourseModalContext.Provider>
  );
}

export function useCourseModal() {
  const context = useContext(CourseModalContext);
  if (!context) throw new Error('useCourseModal must be used inside CourseModalProvider');
  return context;
}
