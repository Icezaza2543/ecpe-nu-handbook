import type { Course } from '../../types/course';
import { useCourseModal } from './CourseModalProvider';

export function CourseChip({ course, courseRef }: { course?: Course; courseRef?: string }) {
  const { openCourse } = useCourseModal();
  const ref = course || courseRef;
  if (!ref) return null;

  return (
    <button className="course-chip" type="button" onClick={() => openCourse(ref)}>
      <span>{course?.code || courseRef}</span>
      {course?.nameTh ? <strong>{course.nameTh}</strong> : null}
    </button>
  );
}
