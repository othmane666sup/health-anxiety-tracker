import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CalendarDays, BarChart3 } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'الرئيسية', end: true },
  { to: '/log', icon: BookOpen, label: 'سجّل' },
  { to: '/history', icon: CalendarDays, label: 'السجل' },
  { to: '/insights', icon: BarChart3, label: 'التحليلات' },
];

export default function BottomNav() {
  return (
    <nav
      style={{
        background: 'rgba(230,242,221,0.97)',
        borderTop: '1px solid rgba(40,90,60,0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all min-w-[64px]"
                style={{ color: isActive ? '#659287' : '#A8A29E' }}>
                <div
                  className="p-1.5 rounded-xl transition-all"
                  style={isActive ? { background: 'rgba(101,146,135,0.1)' } : {}}
                >
                  <Icon className="w-[22px] h-[22px]" />
                </div>
                <span className="text-[10px] font-bold">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
