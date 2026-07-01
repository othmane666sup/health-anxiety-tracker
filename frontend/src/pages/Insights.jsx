import { useEffect, useState } from 'react';
import { statsApi } from '../api';
import { MOOD_COLORS, ANXIETY_COLORS, SYMPTOM_PRESETS } from '../utils/helpers';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, ReferenceLine,
} from 'recharts';

const LightTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#FFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0.75rem',
      padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      {label && <p style={{ color: '#A8A29E', fontSize: '10px', marginBottom: 4 }}>{label}</p>}
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || '#659287', fontSize: '12px', fontWeight: 700 }}>
          {p.name !== undefined ? `${p.name}: ` : ''}{Number(p.value).toFixed(1)}
        </p>
      ))}
    </div>
  );
};

const PERIOD_OPTIONS = [
  { label: '7 أيام', value: 7 },
  { label: '30 يوم', value: 30 },
  { label: '90 يوم', value: 90 },
];

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card flex flex-col" style={{ padding: '1rem' }}>
      <p className="label mb-2">{label}</p>
      <p className="text-3xl font-extrabold" style={{ color }}>{value ?? '—'}</p>
      {sub && <p className="text-[10px] font-bold mt-1.5" style={{ color: '#A8A29E' }}>{sub}</p>}
    </div>
  );
}

export default function Insights() {
  const [period, setPeriod]           = useState(30);
  const [summary, setSummary]         = useState(null);
  const [trend, setTrend]             = useState([]);
  const [topSymptoms, setTopSymptoms] = useState([]);
  const [hourDist, setHourDist]       = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      statsApi.getSummary(period),
      statsApi.getTrend(period),
      statsApi.getTopSymptoms(period),
      statsApi.getHourDistribution(period),
    ])
      .then(([sum, tr, top, dist]) => {
        setSummary(sum);
        setTrend(tr.map(d => ({
          date: d.date.slice(5),
          مزاج: Number(d.mood_rating).toFixed(1),
          قلق:  Number(d.anxiety_level).toFixed(1),
        })));
        setTopSymptoms(top.slice(0, 8));
        const h = Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}`,
          count: dist.find(d => d.hour_of_day === i)?.count ?? 0,
        }));
        setHourDist(h);
      })
      .finally(() => setLoading(false));
  }, [period]);

  const avgMood    = summary?.avg_mood    ? Number(summary.avg_mood).toFixed(1)    : null;
  const avgAnxiety = summary?.avg_anxiety ? Number(summary.avg_anxiety).toFixed(1) : null;
  const maxSym     = topSymptoms[0]?.count || 1;
  const radarData  = topSymptoms.slice(0, 6).map(s => ({
    subject: s.symptom_type.slice(0, 6),
    A: Math.round((s.count / maxSym) * 10),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#659287', borderRightColor: 'rgba(101,146,135,0.2)' }} />
      </div>
    );
  }

  const noData = !summary || Number(summary.days_logged) === 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pt-2">
        <h1 className="page-header">التحليلات</h1>
        <div className="flex items-center rounded-xl p-1 gap-1"
          style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          {PERIOD_OPTIONS.map(o => (
            <button key={o.value} onClick={() => setPeriod(o.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
              style={period === o.value
                ? { background: '#659287', color: '#FFFFFF', boxShadow: '0 1px 6px rgba(101,146,135,0.3)' }
                : { color: '#A8A29E' }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {noData ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📊</p>
          <p className="font-bold" style={{ color: '#78716C' }}>لا توجد بيانات كافية</p>
          <p className="text-sm mt-1" style={{ color: '#A8A29E' }}>ابدأ بتسجيل أيامك لرؤية التحليلات</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="متوسط المزاج"     value={avgMood}               color="#659287" sub={`من ${summary.days_logged} يوم`} />
            <StatCard label="متوسط القلق"      value={avgAnxiety}            color={ANXIETY_COLORS[Math.round(Number(avgAnxiety))] || '#EF4444'} />
            <StatCard label="أيام مسجلة"       value={summary.days_logged}   color="#6366F1" />
            <StatCard label="مجموع الأعراض"    value={summary.total_symptoms} color="#F87171" />
          </div>

          {/* Trend */}
          {trend.length > 1 && (
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <p className="font-extrabold" style={{ color: '#1C1917' }}>الاتجاه</p>
                <div className="flex items-center gap-4 text-[11px] font-bold" style={{ color: '#A8A29E' }}>
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
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={trend} margin={{ top: 5, right: 5, bottom: 0, left: -28 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#C4B8B0' }} axisLine={false} tickLine={false}
                    interval={Math.max(0, Math.floor(trend.length / 7) - 1)} />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 9, fill: '#C4B8B0' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<LightTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1 }} />
                  <ReferenceLine y={5} stroke="rgba(0,0,0,0.05)" />
                  <Line type="monotone" dataKey="مزاج" stroke="#659287" strokeWidth={2} dot={false}
                    activeDot={{ r: 4, fill: '#659287', strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="قلق" stroke="#6366F1" strokeWidth={2} dot={false}
                    strokeDasharray="4 3" activeDot={{ r: 4, fill: '#6366F1', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Symptoms */}
          {topSymptoms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card">
                <p className="font-extrabold mb-5" style={{ color: '#1C1917' }}>أكثر الأعراض</p>
                <div className="space-y-3">
                  {topSymptoms.map((s, i) => {
                    const preset  = SYMPTOM_PRESETS.find(p => p.label === s.symptom_type);
                    const pct     = (s.count / maxSym) * 100;
                    const opacity = 1 - (i / (topSymptoms.length + 1)) * 0.5;
                    return (
                      <div key={s.symptom_type} className="flex items-center gap-3">
                        <span className="text-base w-5 leading-none flex-shrink-0">{preset?.icon || '●'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate mb-1" style={{ color: '#78716C' }}>{s.symptom_type}</p>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#D8EBCF' }}>
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: `rgba(101,146,135,${opacity})` }} />
                          </div>
                        </div>
                        <span className="text-xs font-extrabold w-5 text-right flex-shrink-0"
                          style={{ color: `rgba(101,146,135,${opacity})` }}>
                          {s.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {radarData.length >= 3 ? (
                <div className="card">
                  <p className="font-extrabold mb-1" style={{ color: '#1C1917' }}>نمط الأعراض</p>
                  <p className="label mb-3">الشدة النسبية</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                      <PolarGrid stroke="rgba(0,0,0,0.06)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#A8A29E' }} />
                      <Radar name="أعراض" dataKey="A" stroke="#659287" fill="#659287" fillOpacity={0.1} strokeWidth={1.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="card flex items-center justify-center text-center min-h-[180px]">
                  <div>
                    <p className="text-3xl mb-2">🕸️</p>
                    <p className="text-sm font-bold" style={{ color: '#78716C' }}>سجّل 3 أنواع أعراض أو أكثر</p>
                    <p className="text-[10px] mt-1" style={{ color: '#A8A29E' }}>لعرض مخطط الرادار</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hour distribution */}
          {hourDist.some(h => h.count > 0) && (
            <div className="card">
              <p className="font-extrabold mb-1" style={{ color: '#1C1917' }}>توزيع الأعراض حسب الساعة</p>
              <p className="label mb-5">متى تظهر أعراضك؟</p>
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={hourDist} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={5} barGap={2}>
                  <XAxis dataKey="hour" tick={{ fontSize: 7, fill: '#C4B8B0' }} axisLine={false} tickLine={false} interval={3} />
                  <YAxis hide />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const h  = Number(payload[0]?.payload?.hour);
                      const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
                      return (
                        <div style={{ background: '#FFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0.5rem',
                          padding: '6px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                          <p style={{ color: '#659287', fontSize: '11px', fontWeight: 700 }}>{dh} {h >= 12 ? 'م' : 'ص'}</p>
                          <p style={{ color: '#A8A29E', fontSize: '10px' }}>{payload[0].value} عرض</p>
                        </div>
                      );
                    }}
                    cursor={{ fill: 'rgba(101,146,135,0.04)' }}
                  />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {hourDist.map((e, idx) => {
                      const max = Math.max(...hourDist.map(x => x.count), 1);
                      return (
                        <Cell key={idx}
                          fill={e.count > 0
                            ? `rgba(101,146,135,${0.2 + (e.count / max) * 0.75})`
                            : '#D8EBCF'} />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-between mt-1.5 text-[9px] font-bold px-0.5" style={{ color: '#C4B8B0' }}>
                <span>12 ص</span><span>6 ص</span><span>12 م</span><span>6 م</span><span>11 م</span>
              </div>
            </div>
          )}

          {/* Mood distribution */}
          {avgMood && (
            <div className="card">
              <p className="font-extrabold mb-5" style={{ color: '#1C1917' }}>توزيع المزاج</p>
              <div className="flex items-end gap-1 h-14">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(rating => {
                  const isAvg = Math.round(Number(avgMood)) === rating;
                  return (
                    <div key={rating} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-sm transition-all"
                        style={{
                          height: isAvg ? '100%' : '30%',
                          background: isAvg ? MOOD_COLORS[rating] : MOOD_COLORS[rating] + '35',
                          boxShadow: isAvg ? `0 2px 8px ${MOOD_COLORS[rating]}50` : 'none',
                        }} />
                      <span className="text-[8px] font-bold"
                        style={{ color: isAvg ? MOOD_COLORS[rating] : '#D4C9C1' }}>
                        {rating}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-[10px] font-bold mt-3 uppercase tracking-widest" style={{ color: '#A8A29E' }}>
                المتوسط <span style={{ color: MOOD_COLORS[Math.round(Number(avgMood))] }}>{avgMood}</span> / 10
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
