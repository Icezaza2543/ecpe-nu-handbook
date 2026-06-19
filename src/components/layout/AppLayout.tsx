import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

export function AppLayout() {
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
