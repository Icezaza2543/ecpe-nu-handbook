import { useContext } from 'react';
import { CourseIndexContext } from '../contexts/CourseIndexContext';

export function useCourseIndex() {
  const context = useContext(CourseIndexContext);
  if (!context) {
    throw new Error('useCourseIndex must be used within a CourseIndexProvider');
  }
  return context;
}
