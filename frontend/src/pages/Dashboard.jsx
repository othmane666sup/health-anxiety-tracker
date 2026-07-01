import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { daysApi, statsApi } from '../api';
import {
  MOOD_EMOJIS, ANXIETY_EMOJIS, MOOD_COLORS, ANXIETY_COLORS,
  getMoodLabel, getAnxietyLabel, getGreeting, todayString, formatDate, arDate,
} from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Plus, ChevronLeft } from 'lucide-react';

const LightTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#FFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0.75rem',
      padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <p style={{ color: '#A8A29E', fontSize: '10px', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontSize: '12px', fontWeight: 700 }}>
          {p.name}: {Number(p.value).toFixed(1)}
        </p>
      ))}
    </div>
  );
};

function DayRow({ day }) {
  const mc = MOOD_COLORS[day.mood_rating] || '#659287';
  return (
    <Link
      to={`/log/${day.date}`}
      className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all hover:bg-black/[0.025]"
      style={{ border: '1px solid rgba(0,0,0,0.05)' }}
    >
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: mc }} />
      <span className="text-sm w-28 flex-shrink-0" style={{ color: '#78716C' }}>{formatDate(day.date)}</span>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#D8EBCF' }}>
          <div className="h-full rounded-full" style={{ width: `${day.mood_rating * 10}%`, background: mc }} />
        </div>
        <span className="text-xs font-bold w-5 text-right" style={{ color: mc }}>{day.mood_rating}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs" style={{ color: '#A8A29E' }}>قلق</span>
        <span className="badge text-xs font-bold"
          style={{ background: ANXIETY_COLORS[day.anxiety_level] + '18', color: ANXIETY_COLORS[day.anxiety_level] }}>
          {day.anxiety_level}
        </span>
      </div>
      <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#D4C9C1' }} />
    </Link>
  );
}

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
        setTrendData(trend.map(d => ({
          date: formatDate(d.date),
          مزاج: d.mood_rating,
          قلق:  d.anxiety_level,
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#659287', borderRightColor: 'rgba(101,146,135,0.2)' }} />
      </div>
    );
  }

  const avgMood    = summary?.avg_mood    ? Number(summary.avg_mood).toFixed(1)    : null;
  const avgAnxiety = summary?.avg_anxiety ? Number(summary.avg_anxiety).toFixed(1) : null;

  return (
    <div className="space-y-5">

      {/* Header row */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#A8A29E' }}>
            {arDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-2xl font-extrabold" style={{ color: '#1C1917' }}>{getGreeting()} 👋</h1>
        </div>
        <Link to="/log" className="btn-primary">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">سجّل اليوم</span>
          <span className="sm:hidden">سجّل</span>
        </Link>
      </div>

      {/* TODAY card */}
      {todayLog ? (
        <div className="relative overflow-hidden rounded-2xl"
          style={{
            background: '#FFFFFF',
            borderRight: `4px solid ${MOOD_COLORS[todayLog.mood_rating]}`,
            boxShadow: `0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)`,
            minHeight: '148px',
          }}>
          {/* Ghost numeral */}
          <div aria-hidden className="absolute select-none pointer-events-none font-extrabold leading-none"
            style={{
              fontSize: 'clamp(130px, 28vw, 200px)',
              color: MOOD_COLORS[todayLog.mood_rating],
              opacity: 0.07,
              bottom: '-20px',
              left: '12px',
              fontFamily: 'Cairo',
            }}>
            {todayLog.mood_rating}
          </div>

          <div className="relative p-5">
            <p className="label mb-5">يومك اليوم</p>
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-4xl leading-none">{MOOD_EMOJIS[todayLog.mood_rating]}</span>
                  <span className="text-5xl font-extrabold leading-none"
                    style={{ color: MOOD_COLORS[todayLog.mood_rating] }}>
                    {todayLog.mood_rating}
                  </span>
                  <span className="text-lg font-bold" style={{ color: '#D4C9C1' }}>/10</span>
                </div>
                <p className="text-xs font-bold" style={{ color: '#A8A29E' }}>
                  مزاج · <span style={{ color: MOOD_COLORS[todayLog.mood_rating] }}>{getMoodLabel(todayLog.mood_rating)}</span>
                </p>
              </div>

              <div className="w-px h-10 mx-2" style={{ background: 'rgba(0,0,0,0.07)' }} />

              <div className="text-right">
                <div className="flex items-center gap-3 mb-1 justify-end">
                  <span className="text-lg font-bold" style={{ color: '#D4C9C1' }}>/10</span>
                  <span className="text-5xl font-extrabold leading-none"
                    style={{ color: ANXIETY_COLORS[todayLog.anxiety_level] }}>
                    {todayLog.anxiety_level}
                  </span>
                  <span className="text-4xl leading-none">{ANXIETY_EMOJIS[todayLog.anxiety_level]}</span>
                </div>
                <p className="text-xs font-bold" style={{ color: '#A8A29E' }}>
                  قلق · <span style={{ color: ANXIETY_COLORS[todayLog.anxiety_level] }}>{getAnxietyLabel(todayLog.anxiety_level)}</span>
                </p>
              </div>
            </div>

            <Link to={`/log/${today}`}
              className="mt-5 block text-center text-xs font-bold py-2.5 rounded-xl transition-all"
              style={{ background: '#D8EBCF', color: '#A8A29E' }}>
              عرض وتعديل سجل اليوم
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-8 text-center"
          style={{ border: '2px dashed rgba(101,146,135,0.2)', background: 'rgba(101,146,135,0.03)' }}>
          <p className="text-4xl mb-3">📝</p>
          <p className="font-extrabold text-lg" style={{ color: '#1C1917' }}>لم تسجّل يومك بعد</p>
          <p className="text-sm mt-1 mb-5" style={{ color: '#A8A29E' }}>كيف تشعر الآن؟</p>
          <Link to="/log" className="btn-primary gap-2">
            <Plus className="w-4 h-4" /> ابدأ سجل اليوم
          </Link>
        </div>
      )}

      {/* 7-day stats strip */}
      {summary && Number(summary.days_logged) > 0 && (
        <div className="card">
          <p className="label mb-4">آخر 7 أيام</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: avgMood,               label: 'متوسط المزاج', color: '#659287' },
              { value: avgAnxiety,            label: 'متوسط القلق',  color: ANXIETY_COLORS[Math.round(Number(avgAnxiety))] || '#EF4444' },
              { value: summary.days_logged,   label: 'أيام مسجلة',   color: '#6366F1' },
              { value: summary.total_symptoms,label: 'أعراض',        color: '#F87171' },
            ].map(s => (
              <div key={s.label} className="text-center rounded-xl py-3 px-2"
                style={{ background: '#D8EBCF' }}>
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value ?? '—'}</p>
                <p className="text-[10px] font-bold mt-1 leading-tight" style={{ color: '#A8A29E' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend chart */}
      {trendData.length > 1 && (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <p className="font-extrabold" style={{ color: '#1C1917' }}>اتجاه 14 يوم</p>
            <div className="flex items-center gap-4 text-xs font-bold" style={{ color: '#A8A29E' }}>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded inline-block" style={{ background: '#659287' }} />
                مزاج
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded inline-block" style={{ background: '#6366F1' }} />
                قلق
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: -28 }}>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#C4B8B0' }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 10]} tick={{ fontSize: 9, fill: '#C4B8B0' }} axisLine={false} tickLine={false} />
              <Tooltip content={<LightTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.06)', strokeWidth: 1 }} />
              <ReferenceLine y={5} stroke="rgba(0,0,0,0.05)" />
              <Line type="monotone" dataKey="مزاج" stroke="#659287" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#659287', strokeWidth: 0 }} />
              <Line type="monotone" dataKey="قلق"  stroke="#6366F1" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#6366F1', strokeWidth: 0 }} strokeDasharray="4 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent days */}
      {days.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-extrabold" style={{ color: '#1C1917' }}>الأيام الأخيرة</p>
            <Link to="/history" className="text-xs font-bold" style={{ color: '#659287' }}>عرض الكل ←</Link>
          </div>
          <div className="space-y-1.5">
            {days.slice(0, 7).map(day => <DayRow key={day.id} day={day} />)}
          </div>
        </div>
      )}

      {days.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🌱</p>
          <p className="font-bold" style={{ color: '#78716C' }}>ابدأ رحلتك</p>
          <p className="text-sm mt-1" style={{ color: '#A8A29E' }}>سجّل يومك الأول لرؤية بياناتك هنا</p>
        </div>
      )}
    </div>
  );
}
