import type { CourseIndex } from '../../utils/courseIndex';

export function Topbar({ courseIndex }: { courseIndex: CourseIndex }) {
  return (
    <header className="topbar" style={{ justifyContent: 'flex-end', background: 'transparent', borderBottom: 'none', padding: '16px 32px' }}>
      {/* Search has been removed as per user request */}
    </header>
  );
}
