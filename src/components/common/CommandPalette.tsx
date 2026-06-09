import { useMemo, useState } from 'react';
import { Command, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CourseIndex } from '../../utils/courseIndex';
import { SearchBox } from './SearchBox';
import { useCourseModal } from './CourseModalProvider';

const sectionResults = [
  { label: 'Visual Maps', path: '/visual-maps' },
  { label: 'Course Catalog', path: '/courses' },
  { label: 'Career Roadmaps', path: '/roadmaps' },
  { label: 'Dependency Graph', path: '/dependency-graph' },
  { label: 'Survival Guide', path: '/survival-guide' },
];

export function CommandPalette({ courseIndex }: { courseIndex: CourseIndex }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { openCourse } = useCourseModal();
  const courseResults = useMemo(() => courseIndex.searchCourses(query, 6), [courseIndex, query]);
  const filteredSections = sectionResults.filter((section) => section.label.toLowerCase().includes(query.toLowerCase()));
  const careerResults = useMemo(
    () =>
      Array.from(new Set(courseIndex.courses.flatMap((course) => course.careerPaths || [])))
        .filter((path) => path.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 4),
    [courseIndex.courses, query],
  );

  return (
    <div className="command-palette">
      <button className="command-trigger" type="button" onClick={() => setOpen((value) => !value)}>
        <Command size={18} />
        <span>Search</span>
      </button>
      {open ? (
        <div className="command-popover">
          <SearchBox value={query} onChange={setQuery} placeholder="ค้นหา course, route, career path..." />
          <div className="command-results">
            {courseResults.map(({ course }) => (
              <button
                type="button"
                key={course.id}
                onClick={() => {
                  openCourse(course);
                  setOpen(false);
                }}
              >
                <Search size={14} />
                <span>{course.code} {course.nameTh}</span>
              </button>
            ))}
            {filteredSections.map((section) => (
              <button
                type="button"
                key={section.path}
                onClick={() => {
                  navigate(section.path);
                  setOpen(false);
                }}
              >
                <Command size={14} />
                <span>{section.label}</span>
              </button>
            ))}
            {careerResults.map((path) => (
              <button
                type="button"
                key={path}
                onClick={() => {
                  navigate('/roadmaps');
                  setOpen(false);
                }}
              >
                <Command size={14} />
                <span>{path}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
