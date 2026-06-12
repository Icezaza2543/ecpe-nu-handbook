import { Outlet } from 'react-router-dom';
import type { CourseIndex } from '../../utils/courseIndex';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

export function AppLayout({ courseIndex }: { courseIndex: CourseIndex }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
