import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 pb-24 md:pb-8 page-enter">
        <Outlet />
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
