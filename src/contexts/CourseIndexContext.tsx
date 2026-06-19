import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { CourseIndex } from '../utils/courseIndex';
import { createCourseIndex } from '../utils/courseIndex';
import type { Course } from '../types/course';

export const CourseIndexContext = createContext<CourseIndex | null>(null);

export function CourseIndexProvider({ children }: { children: ReactNode }) {
  const [courseIndex, setCourseIndex] = useState<CourseIndex | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const { courses } = await import('../data/courses');
        
        if (isMounted) {
          const index = createCourseIndex(courses as Course[]);
          setCourseIndex(index);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load course data:', err);
          setError(err instanceof Error ? err : new Error('Failed to load course data'));
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="route-error" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>เกิดข้อผิดพลาดในการโหลดข้อมูล</h2>
        <p>กรุณารีเฟรชหน้าเว็บอีกครั้ง</p>
      </div>
    );
  }

  if (!courseIndex) {
    return (
      <div className="route-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        กำลังโหลดข้อมูลหลักสูตร...
      </div>
    );
  }

  return (
    <CourseIndexContext.Provider value={courseIndex}>
      {children}
    </CourseIndexContext.Provider>
  );
}
