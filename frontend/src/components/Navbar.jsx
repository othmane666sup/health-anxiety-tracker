import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CalendarDays, BarChart3, Brain, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'الرئيسية', end: true },
  { to: '/log', icon: BookOpen, label: 'سجّل اليوم' },
  { to: '/history', icon: CalendarDays, label: 'السجل' },
  { to: '/insights', icon: BarChart3, label: 'التحليلات' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(230,242,221,0.96)',
        borderBottom: '1px solid rgba(40,90,60,0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#659287' }}>
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight" style={{ color: '#1C1917' }}>يومفلو</span>
        </div>
        <div className="flex items-center gap-0.5">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive ? '' : 'hover:bg-black/5'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? '#659287' : '#78716C',
                background: isActive ? 'rgba(101,146,135,0.08)' : undefined,
              })}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
        <button
          onClick={logout}
          title={user?.name}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-black/5 transition-all"
          style={{ color: '#78716C' }}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
