# Arabic Dark Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform DayFlow from a light English UI to a Dark & Modern Arabic RTL experience across 11 frontend files.

**Architecture:** Pure CSS/component layer replacement. No API changes, no new routes, no new dependencies. All 11 files are in `frontend/`. Each task is a self-contained file replacement, verified visually.

**Tech Stack:** React 18, Vite, Tailwind CSS 3, Recharts, Lucide React, Cairo (Google Font)

## Global Constraints

- Font: Cairo (already imported in task 1) — `font-family: 'Cairo', system-ui, sans-serif`
- Direction: `dir="rtl"` on `<html>`, Arabic locale throughout
- Color palette: bg `#080C14`, card `rgba(15,22,35,0.85)`, primary violet `#7C3AED`, cyan `#06B6D4`
- No new npm packages
- No backend changes
- All Arabic text uses Arabic numerals where possible (١٢٣...)

---

### Task 1: Foundation — index.html + tailwind.config.js + index.css

**Files:**
- Modify: `frontend/index.html`
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Replace index.html**

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="theme-color" content="#7C3AED" />
    <title>يومفلو — تتبع الصحة والقلق</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Replace tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#080C14',
          card: '#0F1623',
          input: '#161D2E',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Replace index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; }
  body {
    @apply font-sans text-slate-100;
    background: #080C14;
    -webkit-tap-highlight-color: transparent;
  }
  input[type='range'] {
    @apply w-full;
    accent-color: #7C3AED;
  }
}

@layer components {
  .card {
    background: rgba(15, 22, 35, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.07);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    @apply rounded-2xl p-4;
  }
  .btn-primary {
    @apply bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-5 py-2.5 transition-all active:scale-95;
    box-shadow: 0 0 24px rgba(124, 58, 237, 0.4);
  }
  .btn-ghost {
    @apply text-slate-400 hover:text-slate-200 rounded-xl px-4 py-2 transition-all;
    background: rgba(255, 255, 255, 0.04);
  }
  .badge {
    @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold;
  }
  .label {
    @apply block text-sm font-semibold text-slate-400 mb-1.5;
  }
  .input {
    background: rgba(22, 29, 46, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.08);
    @apply w-full rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none transition;
  }
  .input:focus {
    border-color: rgba(124, 58, 237, 0.5);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
  .page-header {
    @apply text-2xl font-extrabold text-white;
  }
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 9999px; }

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.page-enter {
  animation: fadeSlideUp 0.25s ease forwards;
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 4: Verify** — Run `npm run dev` in `frontend/`, open browser. Background must be near-black (`#080C14`), font must be Cairo (rounded Arabic numerals visible in browser DevTools → Computed → font-family).

---

### Task 2: Utilities — helpers.js (Arabic)

**Files:**
- Modify: `frontend/src/utils/helpers.js`

- [ ] **Step 1: Replace helpers.js entirely**

```js
export const MOOD_EMOJIS = ['', '😰','😟','😕','😐','🙂','😊','😀','😁','🤩','🥳'];
export const ANXIETY_EMOJIS = ['', '😌','🙂','😐','😕','😟','😰','😥','😨','😱','💀'];

export const MOOD_COLORS = {
  1: '#ef4444', 2: '#f97316', 3: '#f59e0b', 4: '#eab308',
  5: '#84cc16', 6: '#22c55e', 7: '#10b981', 8: '#14b8a6',
  9: '#06b6d4', 10: '#7c3aed',
};

export const ANXIETY_COLORS = {
  1: '#7c3aed', 2: '#06b6d4', 3: '#14b8a6', 4: '#10b981',
  5: '#22c55e', 6: '#eab308', 7: '#f59e0b', 8: '#f97316',
  9: '#ef4444', 10: '#dc2626',
};

export const INTENSITY_COLORS = {
  1: '#86efac', 2: '#4ade80', 3: '#fbbf24', 4: '#f97316', 5: '#ef4444',
};

export const SYMPTOM_PRESETS = [
  { label: 'تسارع القلب',     icon: '💓', category: 'physical' },
  { label: 'ضيق التنفس',      icon: '😮‍💨', category: 'physical' },
  { label: 'ضيق في الصدر',    icon: '🫁', category: 'physical' },
  { label: 'دوخة',            icon: '💫', category: 'physical' },
  { label: 'تعرق',            icon: '💧', category: 'physical' },
  { label: 'رعشة',            icon: '🫨', category: 'physical' },
  { label: 'غثيان',           icon: '🤢', category: 'physical' },
  { label: 'صداع',            icon: '🤕', category: 'physical' },
  { label: 'توتر عضلي',       icon: '💪', category: 'physical' },
  { label: 'إرهاق',           icon: '😴', category: 'physical' },
  { label: 'ضباب ذهني',       icon: '🌫️', category: 'mental' },
  { label: 'أفكار متطفلة',    icon: '🌀', category: 'mental' },
  { label: 'نوبة هلع',        icon: '🚨', category: 'mental' },
  { label: 'إرهاق نفسي',      icon: '🌊', category: 'mental' },
  { label: 'قلق حركي',        icon: '🏃', category: 'mental' },
  { label: 'سرعة الانفعال',   icon: '😤', category: 'mental' },
  { label: 'صعوبة التركيز',   icon: '🎯', category: 'mental' },
  { label: 'قلق اجتماعي',     icon: '👥', category: 'mental' },
];

function toAr(n) {
  return String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

export function formatHour(h) {
  if (h === 0)  return '١٢ ص';
  if (h < 12)  return `${toAr(h)} ص`;
  if (h === 12) return '١٢ م';
  return `${toAr(h - 12)} م`;
}

export function getMoodLabel(v) {
  if (v >= 9) return 'رائع';
  if (v >= 7) return 'ممتاز';
  if (v >= 5) return 'جيد';
  if (v >= 3) return 'منخفض';
  return 'سيء';
}

export function getAnxietyLabel(v) {
  if (v >= 9) return 'شديد';
  if (v >= 7) return 'مرتفع';
  if (v >= 5) return 'متوسط';
  if (v >= 3) return 'خفيف';
  return 'هادئ';
}

export function todayString() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('ar-SA', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'صباح الخير';
  if (h < 17) return 'مساء الخير';
  return 'مساء النور';
}
```

- [ ] **Step 2: Verify** — Dev server still runs, no console errors.

---

### Task 3: Shell — Layout.jsx + Navbar.jsx + BottomNav.jsx

**Files:**
- Modify: `frontend/src/components/Layout.jsx`
- Modify: `frontend/src/components/Navbar.jsx`
- Modify: `frontend/src/components/BottomNav.jsx`

- [ ] **Step 1: Replace Layout.jsx**

```jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080C14' }}>
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
```

- [ ] **Step 2: Replace Navbar.jsx**

```jsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CalendarDays, BarChart3, Brain } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'الرئيسية', end: true },
  { to: '/log', icon: BookOpen, label: 'سجّل اليوم' },
  { to: '/history', icon: CalendarDays, label: 'السجل' },
  { to: '/insights', icon: BarChart3, label: 'التحليلات' },
];

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(8,12,20,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
          >
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-white text-xl tracking-tight">يومفلو</span>
        </div>
        <div className="flex items-center gap-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'text-violet-400'
                    : 'text-slate-500 hover:text-slate-200'
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: 'rgba(124,58,237,0.15)' } : {}
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Replace BottomNav.jsx**

```jsx
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
        background: 'rgba(8,12,20,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[60px] ${
                isActive ? 'text-violet-400' : 'text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className="p-1.5 rounded-xl transition-all"
                  style={isActive ? { background: 'rgba(124,58,237,0.18)' } : {}}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Verify** — All 4 nav tabs visible, dark glass navbar on desktop, dark bottom bar on mobile (<768px). Active tab glows violet.

---

### Task 4: Dashboard page

**Files:**
- Modify: `frontend/src/pages/Dashboard.jsx`

- [ ] **Step 1: Replace Dashboard.jsx**

```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { daysApi, statsApi } from '../api';
import {
  MOOD_EMOJIS, ANXIETY_EMOJIS, MOOD_COLORS, ANXIETY_COLORS,
  getMoodLabel, getAnxietyLabel, getGreeting, todayString, formatDate,
} from '../utils/helpers';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Plus, Activity, Moon, Smile, Zap } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + '22' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-extrabold text-white">{value ?? '—'}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function DayCard({ day }) {
  const moodColor = MOOD_COLORS[day.mood_rating] || '#7c3aed';
  const anxColor  = ANXIETY_COLORS[day.anxiety_level] || '#7c3aed';
  return (
    <Link
      to={`/log/${day.date}`}
      className="card flex items-center gap-4 transition-all hover:border-violet-500/30"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: moodColor + '22' }}
      >
        {MOOD_EMOJIS[day.mood_rating]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-slate-200 truncate">{formatDate(day.date)}</div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="badge text-[11px]" style={{ background: moodColor + '22', color: moodColor }}>
            مزاج {day.mood_rating}/١٠
          </span>
          <span className="badge text-[11px]" style={{ background: anxColor + '22', color: anxColor }}>
            قلق {day.anxiety_level}/١٠
          </span>
        </div>
      </div>
      {day.symptom_count > 0 && (
        <span className="badge flex-shrink-0" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
          <Activity className="w-3 h-3" />{day.symptom_count}
        </span>
      )}
    </Link>
  );
}

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs">
      <p className="font-bold text-slate-300 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {Number(p.value).toFixed(1)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [days, setDays]           = useState([]);
  const [summary, setSummary]     = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading]     = useState(true);
  const today    = todayString();
  const todayLog = days.find(d => d.date === today);

  useEffect(() => {
    Promise.all([daysApi.getAll(), statsApi.getSummary(7), statsApi.getTrend(14)])
      .then(([allDays, sum, trend]) => {
        setDays(allDays);
        setSummary(sum);
        setTrendData(
          trend.map(d => ({
            date: formatDate(d.date),
            مزاج: d.mood_rating,
            قلق:  d.anxiety_level,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const avgMood    = summary?.avg_mood    ? Number(summary.avg_mood).toFixed(1)    : null;
  const avgAnxiety = summary?.avg_anxiety ? Number(summary.avg_anxiety).toFixed(1) : null;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">{getGreeting()} 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/log" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">سجّل اليوم</span>
          <span className="sm:hidden">سجّل</span>
        </Link>
      </div>

      {/* Today card */}
      {todayLog ? (
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${MOOD_COLORS[todayLog.mood_rating]}28, ${ANXIETY_COLORS[todayLog.anxiety_level]}28)`,
            border: `1px solid ${MOOD_COLORS[todayLog.mood_rating]}44`,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 15% 50%, ${MOOD_COLORS[todayLog.mood_rating]}18, transparent 60%)`,
            }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">مزاج اليوم</p>
              <div className="flex items-center gap-3">
                <span className="text-5xl">{MOOD_EMOJIS[todayLog.mood_rating]}</span>
                <div>
                  <p className="text-3xl font-extrabold text-white leading-none">{todayLog.mood_rating}<span className="text-lg text-slate-400">/١٠</span></p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: MOOD_COLORS[todayLog.mood_rating] }}>
                    {getMoodLabel(todayLog.mood_rating)}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">مستوى القلق</p>
              <div className="flex items-center gap-3 justify-end">
                <div className="text-left">
                  <p className="text-3xl font-extrabold text-white leading-none">{todayLog.anxiety_level}<span className="text-lg text-slate-400">/١٠</span></p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: ANXIETY_COLORS[todayLog.anxiety_level] }}>
                    {getAnxietyLabel(todayLog.anxiety_level)}
                  </p>
                </div>
                <span className="text-5xl">{ANXIETY_EMOJIS[todayLog.anxiety_level]}</span>
              </div>
            </div>
          </div>
          <Link
            to={`/log/${today}`}
            className="relative mt-4 block text-center text-sm font-bold rounded-xl py-2.5 transition"
            style={{ background: 'rgba(255,255,255,0.07)', color: '#cbd5e1' }}
          >
            عرض وتعديل سجل اليوم ←
          </Link>
        </div>
      ) : (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ border: '1px dashed rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.05)' }}
        >
          <div className="text-5xl mb-3">📝</div>
          <p className="font-extrabold text-slate-200 text-lg">لم تسجّل يومك بعد</p>
          <p className="text-slate-500 text-sm mt-1 mb-5">سجّل كيف تشعر الآن</p>
          <Link to="/log" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> ابدأ سجل اليوم
          </Link>
        </div>
      )}

      {/* Stats grid */}
      {summary && Number(summary.days_logged) > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="متوسط المزاج" value={avgMood} icon={Smile} color="#7c3aed"
            sub={avgMood ? getMoodLabel(Math.round(Number(avgMood))) : null}
          />
          <StatCard
            label="متوسط القلق" value={avgAnxiety} icon={Zap}
            color={Number(avgAnxiety) > 6 ? '#ef4444' : Number(avgAnxiety) > 4 ? '#f59e0b' : '#10b981'}
            sub={avgAnxiety ? getAnxietyLabel(Math.round(Number(avgAnxiety))) : null}
          />
          <StatCard label="أيام مسجلة"   value={summary.days_logged}    icon={Activity} color="#06b6d4" sub="آخر ٧ أيام" />
          <StatCard label="مجموع الأعراض" value={summary.total_symptoms} icon={Moon}     color="#f97316" sub="هذا الأسبوع" />
        </div>
      )}

      {/* Trend chart */}
      {trendData.length > 1 && (
        <div className="card">
          <h2 className="font-bold text-slate-200 mb-4">اتجاه ١٤ يوم</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} />
              <YAxis domain={[1, 10]} tick={{ fontSize: 10, fill: '#475569' }} />
              <Tooltip content={<DarkTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={v => <span style={{ color: '#94a3b8' }}>{v}</span>} />
              <Line type="monotone" dataKey="مزاج" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3, fill: '#7c3aed' }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="قلق"  stroke="#f97316" strokeWidth={2.5} dot={{ r: 3, fill: '#f97316' }} activeDot={{ r: 5 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent days */}
      {days.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-200">الأيام الأخيرة</h2>
            <Link to="/history" className="text-violet-400 text-sm font-bold hover:text-violet-300">عرض الكل ←</Link>
          </div>
          <div className="space-y-2">
            {days.slice(0, 7).map(day => <DayCard key={day.id} day={day} />)}
          </div>
        </div>
      )}

      {days.length === 0 && (
        <div className="text-center py-16 text-slate-600">
          <div className="text-5xl mb-3">🌱</div>
          <p className="font-bold text-slate-400 text-lg">ابدأ رحلتك</p>
          <p className="text-sm mt-1">سجّل يومك الأول لرؤية بياناتك هنا</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify** — Dashboard renders dark. Greeting in Arabic. Stats cards visible. Chart lines visible on dark grid. "Log Today" button glows violet.

---

### Task 5: Daily Log page

**Files:**
- Modify: `frontend/src/pages/DailyLog.jsx`

- [ ] **Step 1: Replace DailyLog.jsx**

```jsx
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { daysApi, symptomsApi } from '../api';
import {
  MOOD_EMOJIS, ANXIETY_EMOJIS, MOOD_COLORS, ANXIETY_COLORS,
  SYMPTOM_PRESETS, INTENSITY_COLORS, formatHour, todayString,
} from '../utils/helpers';
import { Plus, X, Clock, ChevronLeft, ChevronRight, Check, Trash2 } from 'lucide-react';

function SymptomModal({ hour, onClose, onSave }) {
  const [type, setType]               = useState('');
  const [custom, setCustom]           = useState('');
  const [intensity, setIntensity]     = useState(3);
  const [selectedHour, setSelectedHour] = useState(hour ?? new Date().getHours());
  const [notes, setNotes]             = useState('');
  const [tab, setTab]                 = useState('physical');

  const finalType = type === '__custom__' ? custom.trim() : type;
  const canSave   = finalType.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
        style={{ background: '#0F1623', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="font-extrabold text-white">إضافة عرض</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Time */}
          <div>
            <label className="label flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-violet-400" /> الوقت</label>
            <select value={selectedHour} onChange={e => setSelectedHour(Number(e.target.value))} className="input">
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{formatHour(i)}</option>
              ))}
            </select>
          </div>

          {/* Type tabs */}
          <div>
            <label className="label">العرض</label>
            <div className="flex gap-2 mb-3">
              {[['physical', '🫀 جسدية'], ['mental', '🧠 نفسية']].map(([t, l]) => (
                <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                  style={tab === t
                    ? { background: 'rgba(124,58,237,0.3)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.5)' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid transparent' }}>
                  {l}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SYMPTOM_PRESETS.filter(s => s.category === tab).map(s => (
                <button key={s.label} onClick={() => { setType(s.label); setCustom(''); }}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all text-right"
                  style={type === s.label
                    ? { background: 'rgba(124,58,237,0.25)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
              <button onClick={() => setType('__custom__')}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all"
                style={type === '__custom__'
                  ? { background: 'rgba(124,58,237,0.25)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Plus className="w-3 h-3" /> مخصص
              </button>
            </div>
            {type === '__custom__' && (
              <input className="input mt-2" placeholder="صف عرضك..." value={custom}
                onChange={e => setCustom(e.target.value)} autoFocus />
            )}
          </div>

          {/* Intensity */}
          <div>
            <label className="label">الشدة</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setIntensity(n)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-extrabold transition-all"
                  style={{
                    background: INTENSITY_COLORS[n] + '22',
                    color: INTENSITY_COLORS[n],
                    border: intensity === n ? `2px solid ${INTENSITY_COLORS[n]}` : '2px solid transparent',
                    transform: intensity === n ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: intensity === n ? `0 0 12px ${INTENSITY_COLORS[n]}55` : 'none',
                  }}>
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-600">
              <span>خفيف</span><span>شديد</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">ملاحظات (اختياري)</label>
            <textarea className="input resize-none" rows={2} placeholder="أي تفاصيل..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => canSave && onSave({ symptom_type: finalType, intensity, hour_of_day: selectedHour, notes })}
            disabled={!canSave}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
            <Check className="w-4 h-4" /> حفظ العرض
          </button>
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ hour, symptoms, onAddClick }) {
  const isNow = new Date().getHours() === hour;
  return (
    <div className={`flex items-start gap-3 py-2 px-3 rounded-xl transition-all group ${
      isNow ? '' : 'hover:bg-white/[0.02]'
    }`}
      style={isNow ? { background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' } : {}}>
      <div className={`w-14 text-xs font-bold pt-1 flex-shrink-0 ${isNow ? 'text-violet-400' : 'text-slate-600'}`}>
        {formatHour(hour)}
        {isNow && <span className="mr-1 text-[9px] text-white rounded px-1 py-0.5 align-middle font-bold"
          style={{ background: '#7c3aed' }}>الآن</span>}
      </div>
      <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 min-h-[28px] items-center">
        {symptoms.map(s => (
          <span key={s.id} className="badge text-[11px]"
            style={{ background: INTENSITY_COLORS[s.intensity] + '22', color: INTENSITY_COLORS[s.intensity] }}>
            {SYMPTOM_PRESETS.find(p => p.label === s.symptom_type)?.icon || '●'} {s.symptom_type}
          </span>
        ))}
      </div>
      <button onClick={() => onAddClick(hour)}
        className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-xl transition-all text-slate-600 hover:text-violet-400 ${
          symptoms.length > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{ background: 'rgba(255,255,255,0.04)' }}>
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function SymptomItem({ symptom, onDelete }) {
  const preset = SYMPTOM_PRESETS.find(p => p.label === symptom.symptom_type);
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl"
      style={{ background: 'rgba(15,22,35,0.85)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-xl">{preset?.icon || '●'}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-200 text-sm">{symptom.symptom_type}</p>
        <p className="text-xs text-slate-600">{formatHour(symptom.hour_of_day)}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(n => (
            <div key={n} className="w-2 h-2 rounded-full"
              style={{ background: n <= symptom.intensity ? INTENSITY_COLORS[symptom.intensity] : 'rgba(255,255,255,0.08)' }} />
          ))}
        </div>
        <button onClick={() => onDelete(symptom.id)}
          className="w-7 h-7 flex items-center justify-center rounded-xl transition-all text-slate-600 hover:text-red-400"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function DailyLog() {
  const { date: paramDate } = useParams();
  const navigate            = useNavigate();
  const [date, setDate]     = useState(paramDate || todayString());
  const [dayData, setDayData]   = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [form, setForm]         = useState({ mood_rating: 7, anxiety_level: 3, sleep_hours: '', notes: '' });
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [modalHour, setModalHour]   = useState(null);
  const [showAllHours, setShowAllHours] = useState(false);

  const load = useCallback(async (d) => {
    try {
      const [day, syms] = await Promise.all([
        daysApi.getByDate(d).catch(() => null),
        symptomsApi.getByDate(d),
      ]);
      if (day) {
        setDayData(day);
        setForm({ mood_rating: day.mood_rating, anxiety_level: day.anxiety_level, sleep_hours: day.sleep_hours ?? '', notes: day.notes ?? '' });
      } else {
        setDayData(null);
        setForm({ mood_rating: 7, anxiety_level: 3, sleep_hours: '', notes: '' });
      }
      setSymptoms(syms);
    } catch {}
  }, []);

  useEffect(() => { load(date); }, [date, load]);

  const handleDateChange = (offset) => {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() + offset);
    const newDate = d.toISOString().split('T')[0];
    setDate(newDate);
    navigate(`/log/${newDate}`, { replace: true });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const day = await daysApi.save({ date, ...form });
      setDayData(day);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { alert('خطأ في الحفظ: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleAddSymptom = async ({ symptom_type, intensity, hour_of_day, notes }) => {
    let id = dayData?.id;
    if (!id) {
      const day = await daysApi.save({ date, ...form });
      setDayData(day);
      id = day.id;
    }
    const s = await symptomsApi.add({ day_id: id, symptom_type, intensity, hour_of_day, notes });
    setSymptoms(prev => [...prev, s]);
    setModalHour(null);
  };

  const handleDeleteSymptom = async (id) => {
    await symptomsApi.remove(id);
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const isToday       = date === todayString();
  const currentHour   = new Date().getHours();
  const symptomsByHour = {};
  symptoms.forEach(s => {
    if (!symptomsByHour[s.hour_of_day]) symptomsByHour[s.hour_of_day] = [];
    symptomsByHour[s.hour_of_day].push(s);
  });

  const allHours = Array.from({ length: 24 }, (_, i) => i);
  const displayHours = showAllHours
    ? allHours
    : allHours.filter(h => symptoms.some(s => s.hour_of_day === h) || (isToday && Math.abs(h - currentHour) <= 3))
        .slice(0, 16);
  const finalHours = displayHours.length > 0 ? displayHours : Array.from({ length: 8 }, (_, i) => i + 8);

  const moodColor = MOOD_COLORS[form.mood_rating];
  const anxColor  = ANXIETY_COLORS[form.anxiety_level];

  return (
    <div className="space-y-5">

      {/* Date nav */}
      <div className="flex items-center justify-between">
        <button onClick={() => handleDateChange(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="font-extrabold text-white">
            {isToday ? 'اليوم' : new Date(date + 'T12:00:00').toLocaleDateString('ar-SA', { weekday: 'long' })}
          </p>
          <p className="text-slate-500 text-sm">
            {new Date(date + 'T12:00:00').toLocaleDateString('ar-SA', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => handleDateChange(1)} disabled={date >= todayString()}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-all disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Ratings card */}
      <div className="card space-y-6">
        <h2 className="font-extrabold text-white">كيف كان يومك؟</h2>

        {/* Mood */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label mb-0">تقييم المزاج</label>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{MOOD_EMOJIS[form.mood_rating]}</span>
              <span className="text-2xl font-extrabold" style={{ color: moodColor }}>{form.mood_rating}<span className="text-base text-slate-500">/١٠</span></span>
            </div>
          </div>
          <input type="range" min={1} max={10} value={form.mood_rating}
            onChange={e => setForm(f => ({ ...f, mood_rating: Number(e.target.value) }))}
            style={{ accentColor: moodColor }} />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>😰 سيء</span><span>🥳 رائع</span>
          </div>
        </div>

        {/* Anxiety */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label mb-0">مستوى القلق</label>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{ANXIETY_EMOJIS[form.anxiety_level]}</span>
              <span className="text-2xl font-extrabold" style={{ color: anxColor }}>{form.anxiety_level}<span className="text-base text-slate-500">/١٠</span></span>
            </div>
          </div>
          <input type="range" min={1} max={10} value={form.anxiety_level}
            onChange={e => setForm(f => ({ ...f, anxiety_level: Number(e.target.value) }))}
            style={{ accentColor: anxColor }} />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>😌 هادئ</span><span>💀 شديد</span>
          </div>
        </div>

        {/* Sleep */}
        <div>
          <label className="label">ساعات النوم</label>
          <div className="flex items-center gap-3">
            <input type="number" min={0} max={24} step={0.5} className="input w-28"
              placeholder="مثال: ٧.٥" value={form.sleep_hours}
              onChange={e => setForm(f => ({ ...f, sleep_hours: e.target.value }))} />
            <span className="text-slate-500 text-sm">ساعة الليلة الماضية</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label">ملاحظات اليوم</label>
          <textarea className="input resize-none" rows={3}
            placeholder="كيف تشعر؟ ماذا حدث اليوم؟ أي مثيرات؟"
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        <button onClick={handleSave} disabled={saving}
          className={`btn-primary w-full flex items-center justify-center gap-2 ${saved ? '!bg-emerald-600' : ''}`}
          style={saved ? { boxShadow: '0 0 24px rgba(16,185,129,0.4)' } : {}}>
          {saving
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : saved ? <><Check className="w-4 h-4" /> تم الحفظ!</>
            : 'حفظ اليوم'}
        </button>
      </div>

      {/* Timeline */}
      <div className="card space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-extrabold text-white">جدول الأعراض</h2>
          <button onClick={() => setModalHour(currentHour)}
            className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 font-bold">
            <Plus className="w-4 h-4" /> إضافة
          </button>
        </div>
        <div className="space-y-0.5">
          {finalHours.map(hour => (
            <TimelineRow key={hour} hour={hour} symptoms={symptomsByHour[hour] || []} onAddClick={setModalHour} />
          ))}
        </div>
        <button onClick={() => setShowAllHours(v => !v)}
          className="w-full text-center text-xs text-slate-600 hover:text-slate-400 py-1 transition-colors">
          {showAllHours ? 'عرض أقل ↑' : 'عرض ٢٤ ساعة ↓'}
        </button>
      </div>

      {/* Symptoms list */}
      {symptoms.length > 0 && (
        <div>
          <h2 className="font-bold text-slate-200 mb-3">جميع الأعراض ({symptoms.length})</h2>
          <div className="space-y-2">
            {[...symptoms].sort((a, b) => a.hour_of_day - b.hour_of_day).map(s => (
              <SymptomItem key={s.id} symptom={s} onDelete={handleDeleteSymptom} />
            ))}
          </div>
        </div>
      )}

      {modalHour !== null && (
        <SymptomModal hour={modalHour} onClose={() => setModalHour(null)} onSave={handleAddSymptom} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify** — Dark sliders with color glow. Arabic time labels on timeline (١ ص / ٢ م). Symptom modal opens dark. Intensity buttons glow on selection. Save button turns emerald on success.

---

### Task 6: History page

**Files:**
- Modify: `frontend/src/pages/History.jsx`

- [ ] **Step 1: Replace History.jsx**

```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { daysApi, symptomsApi } from '../api';
import {
  MOOD_EMOJIS, ANXIETY_EMOJIS, MOOD_COLORS, ANXIETY_COLORS,
  getMoodLabel, getAnxietyLabel, SYMPTOM_PRESETS, formatHour,
} from '../utils/helpers';
import { ChevronLeft, ChevronRight, Activity, Moon, X } from 'lucide-react';

function CalendarDay({ day, isSelected, onClick }) {
  if (!day) return <div className="aspect-square" />;
  const bg      = day.log ? MOOD_COLORS[day.log.mood_rating] : null;
  const isToday = day.date === new Date().toISOString().split('T')[0];

  return (
    <button
      onClick={() => onClick(day)}
      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
        isSelected ? 'ring-2 ring-violet-400 ring-offset-1 ring-offset-transparent' : ''
      } ${day.log ? 'hover:scale-105' : 'cursor-default'}`}
      style={{
        background: bg ? bg + '28' : isToday ? 'rgba(124,58,237,0.15)' : 'transparent',
        color:      bg ? bg        : isToday ? '#a78bfa'               : '#475569',
        border:     bg ? `1px solid ${bg}33` : isToday ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
        boxShadow:  day.log && isSelected ? `0 0 16px ${bg}44` : 'none',
      }}
    >
      <span className="text-sm">{day.num}</span>
      {day.log && <span className="text-base leading-none mt-0.5">{MOOD_EMOJIS[day.log.mood_rating]}</span>}
      {isToday && !day.log && <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: '#7c3aed' }} />}
    </button>
  );
}

function DayDetail({ day, onClose }) {
  const [symptoms, setSymptoms] = useState([]);
  useEffect(() => { symptomsApi.getByDate(day.date).then(setSymptoms); }, [day.date]);

  const moodColor = MOOD_COLORS[day.log.mood_rating];
  const anxColor  = ANXIETY_COLORS[day.log.anxiety_level];

  return (
    <div className="card space-y-4" style={{ borderLeft: `3px solid ${moodColor}` }}>
      <div className="flex items-center justify-between">
        <p className="font-extrabold text-white">
          {new Date(day.date + 'T12:00:00').toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex items-center gap-3">
          <Link to={`/log/${day.date}`} className="text-xs text-violet-400 font-bold hover:text-violet-300">تعديل</Link>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3 text-center" style={{ background: moodColor + '18', border: `1px solid ${moodColor}33` }}>
          <p className="text-3xl">{MOOD_EMOJIS[day.log.mood_rating]}</p>
          <p className="font-extrabold mt-1 text-lg" style={{ color: moodColor }}>{day.log.mood_rating}/١٠</p>
          <p className="text-xs text-slate-500 mt-0.5">{getMoodLabel(day.log.mood_rating)}</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: anxColor + '18', border: `1px solid ${anxColor}33` }}>
          <p className="text-3xl">{ANXIETY_EMOJIS[day.log.anxiety_level]}</p>
          <p className="font-extrabold mt-1 text-lg" style={{ color: anxColor }}>{day.log.anxiety_level}/١٠</p>
          <p className="text-xs text-slate-500 mt-0.5">{getAnxietyLabel(day.log.anxiety_level)}</p>
        </div>
      </div>

      {day.log.sleep_hours && (
        <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
          <Moon className="w-4 h-4 text-violet-400" />
          <span>نام <strong className="text-white">{day.log.sleep_hours}</strong> ساعة</span>
        </div>
      )}

      {day.log.notes && (
        <div className="rounded-xl p-3 text-sm italic text-slate-400"
          style={{ background: 'rgba(255,255,255,0.04)', borderRight: '2px solid rgba(124,58,237,0.4)' }}>
          "{day.log.notes}"
        </div>
      )}

      {symptoms.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3" /> {symptoms.length} عرض
          </p>
          <div className="space-y-1.5">
            {[...symptoms].sort((a, b) => a.hour_of_day - b.hour_of_day).map(s => {
              const preset = SYMPTOM_PRESETS.find(p => p.label === s.symptom_type);
              return (
                <div key={s.id} className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600 text-xs w-10 text-left">{formatHour(s.hour_of_day)}</span>
                  <span className="text-slate-600">·</span>
                  <span>{preset?.icon || '●'}</span>
                  <span className="text-slate-300">{s.symptom_type}</span>
                  <span className="mr-auto text-xs font-bold" style={{
                    color: s.intensity >= 4 ? '#ef4444' : s.intensity >= 3 ? '#f97316' : '#22c55e',
                  }}>
                    {'●'.repeat(s.intensity)}{'○'.repeat(5 - s.intensity)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function History() {
  const [allDays, setAllDays]       = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  useEffect(() => { daysApi.getAll().then(setAllDays); }, []);

  const logsByDate = {};
  allDays.forEach(d => { logsByDate[d.date] = d; });

  const firstOfMonth = new Date(currentMonth.year, currentMonth.month, 1);
  const daysInMonth  = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const startDay     = firstOfMonth.getDay();

  const calendarCells = [];
  for (let i = 0; i < startDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    calendarCells.push({ num: d, date: dateStr, log: logsByDate[dateStr] || null });
  }

  const monthName = firstOfMonth.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
  const isCurrentMonth = currentMonth.year === new Date().getFullYear() && currentMonth.month === new Date().getMonth();
  const loggedThisMonth = calendarCells.filter(c => c?.log).length;

  const goMonth = (offset) => {
    setCurrentMonth(m => {
      const d = new Date(m.year, m.month + offset, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    setSelectedDay(null);
  };

  const handleDayClick = (day) => {
    if (!day.log) return;
    setSelectedDay(prev => prev?.date === day.date ? null : day);
  };

  return (
    <div className="space-y-5">
      <h1 className="page-header">السجل</h1>

      {/* Calendar */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => goMonth(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="font-extrabold text-white">{monthName}</p>
            <p className="text-xs text-slate-500">{loggedThisMonth} يوم مسجل</p>
          </div>
          <button onClick={() => goMonth(1)} disabled={isCurrentMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition disabled:opacity-20"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['ح','ن','ث','ر','خ','ج','س'].map(d => (
            <div key={d} className="text-center text-xs font-bold py-1" style={{ color: '#475569' }}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, i) => (
            <CalendarDay key={i} day={day} isSelected={selectedDay?.date === day?.date} onClick={handleDayClick} />
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
          <span>لون المزاج:</span>
          {[2,4,6,8,10].map(n => (
            <span key={n} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ background: MOOD_COLORS[n] }} />
              {getMoodLabel(n)}
            </span>
          ))}
        </div>
      </div>

      {selectedDay?.log && (
        <DayDetail day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}

      {/* List */}
      <div>
        <h2 className="font-bold text-slate-200 mb-3">جميع الأيام المسجلة</h2>
        {allDays.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <div className="text-4xl mb-2">📅</div>
            <p>لا توجد أيام مسجلة</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allDays.map(day => (
              <Link key={day.id} to={`/log/${day.date}`} className="card flex items-center gap-3 hover:border-violet-500/30 transition-all">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: MOOD_COLORS[day.mood_rating] + '22' }}>
                  {MOOD_EMOJIS[day.mood_rating]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-200 text-sm">
                    {new Date(day.date + 'T12:00:00').toLocaleDateString('ar-SA', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs font-bold" style={{ color: MOOD_COLORS[day.mood_rating] }}>😊 {day.mood_rating}/١٠</span>
                    <span className="text-xs font-bold" style={{ color: ANXIETY_COLORS[day.anxiety_level] }}>⚡ {day.anxiety_level}/١٠</span>
                    {day.symptom_count > 0 && <span className="text-xs text-slate-600">· {day.symptom_count} أعراض</span>}
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-700 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — Calendar has dark background, logged days glow with mood color, Arabic weekday headers (ح ن ث ر خ ج س), detail panel shows dark with colored left border.

---

### Task 7: Insights page

**Files:**
- Modify: `frontend/src/pages/Insights.jsx`

- [ ] **Step 1: Replace Insights.jsx**

```jsx
import { useEffect, useState } from 'react';
import { statsApi } from '../api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { MOOD_COLORS, ANXIETY_COLORS, INTENSITY_COLORS, SYMPTOM_PRESETS, getMoodLabel, getAnxietyLabel, formatHour } from '../utils/helpers';

const PERIODS = [
  { label: '٧ أيام',  value: 7  },
  { label: '٣٠ يوم', value: 30 },
  { label: '٩٠ يوم', value: 90 },
];

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs max-w-[180px]">
      <p className="font-bold text-slate-300 mb-1 truncate">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Insights() {
  const [period, setPeriod]         = useState(30);
  const [summary, setSummary]       = useState(null);
  const [trend, setTrend]           = useState([]);
  const [topSymptoms, setTopSymptoms] = useState([]);
  const [hourDist, setHourDist]     = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      statsApi.getSummary(period),
      statsApi.getTrend(period),
      statsApi.getTopSymptoms(period),
      statsApi.getHourDistribution(period),
    ]).then(([sum, tr, sym, hr]) => {
      setSummary(sum);
      setTrend(tr.map(d => ({
        date:    new Date(d.date + 'T12:00:00').toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
        مزاج:   d.mood_rating,
        قلق:    d.anxiety_level,
        أعراض:  d.symptom_count,
      })));
      setTopSymptoms(sym.map(s => ({
        name:      s.symptom_type,
        count:     s.count,
        intensity: Number(s.avg_intensity).toFixed(1),
        icon:      SYMPTOM_PRESETS.find(p => p.label === s.symptom_type)?.icon || '●',
      })));
      const hrMap = {};
      hr.forEach(h => { hrMap[h.hour_of_day] = h; });
      setHourDist(Array.from({ length: 24 }, (_, i) => ({
        hour:      formatHour(i),
        count:     hrMap[i]?.count || 0,
        intensity: hrMap[i]?.avg_intensity ? Number(hrMap[i].avg_intensity).toFixed(1) : 0,
      })));
    }).finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const avgMood    = summary?.avg_mood    ? Number(summary.avg_mood).toFixed(1)    : null;
  const avgAnxiety = summary?.avg_anxiety ? Number(summary.avg_anxiety).toFixed(1) : null;
  const avgSleep   = summary?.avg_sleep   ? Number(summary.avg_sleep).toFixed(1)   : null;
  const daysLogged = summary?.days_logged || 0;

  const worstHours = [...hourDist].filter(h => h.count > 0).sort((a, b) => b.count - a.count).slice(0, 3);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-header">التحليلات</h1>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={period === p.value
                ? { background: '#7C3AED', color: '#fff', boxShadow: '0 0 12px rgba(124,58,237,0.5)' }
                : { color: '#64748b' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {daysLogged === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="text-5xl mb-3">📊</div>
          <p className="font-bold text-slate-400 text-lg">لا توجد بيانات</p>
          <p className="text-sm mt-1">ابدأ التسجيل لرؤية تحليلاتك</p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'متوسط المزاج',    value: avgMood,            color: MOOD_COLORS[Math.round(Number(avgMood))] || '#7c3aed', sub: avgMood ? getMoodLabel(Math.round(Number(avgMood))) : null },
              { label: 'متوسط القلق',     value: avgAnxiety,         color: ANXIETY_COLORS[Math.round(Number(avgAnxiety))] || '#f97316', sub: avgAnxiety ? getAnxietyLabel(Math.round(Number(avgAnxiety))) : null },
              { label: 'متوسط النوم',     value: avgSleep ? `${avgSleep}س` : null, color: '#06b6d4', sub: 'ساعات' },
              { label: 'مجموع الأعراض',  value: summary?.total_symptoms, color: '#ef4444', sub: null },
            ].map(s => (
              <div key={s.label} className="card text-center">
                <div className="text-3xl font-extrabold" style={{ color: s.color }}>{s.value ?? '—'}</div>
                <p className="text-xs text-slate-500 mt-1 font-bold">{s.label}</p>
                {s.sub && <p className="text-xs mt-0.5" style={{ color: s.color }}>{s.sub}</p>}
              </div>
            ))}
          </div>

          {/* Streak */}
          <div className="card flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="text-4xl">🔥</div>
            <div>
              <p className="font-extrabold text-white">{daysLogged} أيام مسجلة</p>
              <p className="text-xs text-slate-500 mt-0.5">
                من آخر {period} يوم — انتظام {Math.round(daysLogged / period * 100)}٪
              </p>
            </div>
          </div>

          {/* Trend chart */}
          {trend.length > 1 && (
            <div className="card">
              <h2 className="font-bold text-slate-200 mb-4">اتجاه المزاج والقلق</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} interval="preserveStartEnd" />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 10, fill: '#475569' }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} formatter={v => <span style={{ color: '#94a3b8' }}>{v}</span>} />
                  <Line type="monotone" dataKey="مزاج" stroke="#7c3aed" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#7c3aed' }} />
                  <Line type="monotone" dataKey="قلق"  stroke="#f97316" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#f97316' }} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top symptoms */}
          {topSymptoms.length > 0 && (
            <div className="card">
              <h2 className="font-bold text-slate-200 mb-4">الأعراض الأكثر شيوعاً</h2>
              <div className="space-y-3">
                {topSymptoms.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-200 truncate">{s.name}</span>
                        <span className="text-xs text-slate-500 mr-2 flex-shrink-0">{s.count}×</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${(s.count / topSymptoms[0].count) * 100}%`,
                            background: i === 0 ? '#ef4444' : i === 1 ? '#f97316' : i === 2 ? '#f59e0b' : '#7c3aed',
                            boxShadow: `0 0 8px ${i === 0 ? '#ef444466' : i === 1 ? '#f9731666' : '#7c3aed66'}`,
                          }} />
                      </div>
                    </div>
                    <span className="text-xs font-extrabold w-8 text-right flex-shrink-0"
                      style={{ color: Number(s.intensity) >= 4 ? '#ef4444' : Number(s.intensity) >= 3 ? '#f97316' : '#22c55e' }}>
                      {s.intensity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hour distribution */}
          {hourDist.some(h => h.count > 0) && (
            <div className="card">
              <h2 className="font-bold text-slate-200 mb-1">الأعراض حسب وقت اليوم</h2>
              {worstHours.length > 0 && (
                <p className="text-xs text-slate-500 mb-4">أوقات الذروة: {worstHours.map(h => h.hour).join('، ')}</p>
              )}
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={hourDist} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 8, fill: '#475569' }} interval={3}
                    tickFormatter={v => v.replace(' ص','ص').replace(' م','م')} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} allowDecimals={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" name="أعراض" radius={[4,4,0,0]}>
                    {hourDist.map((entry, i) => (
                      <Cell key={i}
                        fill={entry.count === 0 ? 'rgba(255,255,255,0.04)' : entry.count >= 5 ? '#ef4444' : entry.count >= 3 ? '#f97316' : '#7c3aed'}
                        fillOpacity={entry.count === 0 ? 0.5 : 1}
                        style={entry.count > 0 ? { filter: 'drop-shadow(0 0 4px currentColor)' } : {}}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Symptom load */}
          {trend.some(d => d['أعراض'] > 0) && (
            <div className="card">
              <h2 className="font-bold text-slate-200 mb-4">الحمل اليومي للأعراض</h2>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={trend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} allowDecimals={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="أعراض" fill="#7c3aed" radius={[4,4,0,0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify** — Dark charts render. Period selector glows violet on active. Progress bars glow with drop-shadow. Arabic chart labels visible.

---

## Self-Review

**Spec coverage:**
- ✅ `dir="rtl" lang="ar"` on HTML (Task 1)
- ✅ Cairo font (Task 1)
- ✅ Dark color palette — `#080C14` bg, `rgba(15,22,35,0.85)` card (Tasks 1, 3-7)
- ✅ Glassmorphism cards with blur + border (Task 1 CSS)
- ✅ Primary violet `#7C3AED`, accent cyan `#06B6D4` (Tasks 1, 4-7)
- ✅ Arabic symptom presets (Task 2)
- ✅ Arabic time formatting with Arabic numerals ١٢ص (Task 2)
- ✅ Arabic labels: mood/anxiety/greeting/dates (Tasks 2, 4-7)
- ✅ All 4 pages rewritten: Dashboard, DailyLog, History, Insights (Tasks 4-7)
- ✅ Nav components dark: Navbar + BottomNav (Task 3)
- ✅ Violet glow on active nav items (Task 3)
- ✅ Chart tooltips dark (Tasks 4, 7)
- ✅ Calendar Arabic weekday headers ح/ن/ث/ر/خ/ج/س (Task 6)

**Placeholder scan:** None found. All steps contain complete file content.

**Type consistency:** All helper functions (`formatHour`, `getMoodLabel`, `getAnxietyLabel`, `formatDate`, `getGreeting`, `todayString`) defined in Task 2 and used identically in Tasks 4–7.
