import { useMemo } from 'react';
import { courses } from '../data/courses';
import type { Course } from '../types/course';
import { createCourseIndex } from '../utils/courseIndex';

export function useCourseIndex() {
  return useMemo(() => createCourseIndex(courses as Course[]), []);
}
