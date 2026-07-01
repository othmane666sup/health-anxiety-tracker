import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { daysApi, symptomsApi } from '../api';
import {
  MOOD_EMOJIS, ANXIETY_EMOJIS, MOOD_COLORS, ANXIETY_COLORS,
  getMoodLabel, getAnxietyLabel, SYMPTOM_PRESETS, formatHour, arDate,
} from '../utils/helpers';
import { ChevronLeft, ChevronRight, X, Activity } from 'lucide-react';

function CalendarDay({ day, isSelected, onClick }) {
  if (!day) return <div className="aspect-square" />;
  const mc      = day.log ? MOOD_COLORS[day.log.mood_rating] : null;
  const isToday = day.date === new Date().toISOString().split('T')[0];

  return (
    <button
      onClick={() => onClick(day)}
      className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
        day.log ? 'hover:scale-105' : 'cursor-default'
      }`}
      style={{
        background: mc
          ? isSelected ? mc + '22' : mc + '14'
          : isToday ? 'rgba(101,146,135,0.06)' : 'transparent',
        border: isSelected
          ? `2px solid ${mc || '#659287'}`
          : mc
          ? `1px solid ${mc}30`
          : isToday
          ? '1px solid rgba(101,146,135,0.2)'
          : '1px solid transparent',
        boxShadow: isSelected && mc ? `0 2px 10px ${mc}30` : 'none',
      }}
    >
      <span className="text-xs font-bold leading-none"
        style={{ color: mc ? mc : isToday ? '#659287' : '#A8A29E' }}>
        {day.num}
      </span>
      {day.log && <span className="text-sm leading-none mt-0.5">{MOOD_EMOJIS[day.log.mood_rating]}</span>}
      {isToday && !day.log && (
        <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: '#659287' }} />
      )}
    </button>
  );
}

function DayDetail({ day, onClose }) {
  const [symptoms, setSymptoms] = useState([]);
  useEffect(() => { symptomsApi.getByDate(day.date).then(setSymptoms); }, [day.date]);

  const mc  = MOOD_COLORS[day.log.mood_rating];
  const axc = ANXIETY_COLORS[day.log.anxiety_level];

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)',
        borderTop: `3px solid ${mc}`,
      }}>
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <p className="font-extrabold" style={{ color: '#1C1917' }}>
          {arDate(new Date(day.date + 'T12:00:00'), { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <div className="flex items-center gap-3">
          <Link to={`/log/${day.date}`} className="text-xs font-bold" style={{ color: '#659287' }}>تعديل</Link>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-xl"
            style={{ background: '#D8EBCF', color: '#78716C' }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-stretch gap-3">
          <div className="flex-1 rounded-xl p-4 text-center"
            style={{ background: mc + '0F', border: `1px solid ${mc}20` }}>
            <p className="text-3xl mb-2">{MOOD_EMOJIS[day.log.mood_rating]}</p>
            <p className="text-2xl font-extrabold" style={{ color: mc }}>{day.log.mood_rating}/10</p>
            <p className="text-xs font-bold mt-1" style={{ color: '#A8A29E' }}>{getMoodLabel(day.log.mood_rating)}</p>
          </div>
          <div className="flex-1 rounded-xl p-4 text-center"
            style={{ background: axc + '0F', border: `1px solid ${axc}20` }}>
            <p className="text-3xl mb-2">{ANXIETY_EMOJIS[day.log.anxiety_level]}</p>
            <p className="text-2xl font-extrabold" style={{ color: axc }}>{day.log.anxiety_level}/10</p>
            <p className="text-xs font-bold mt-1" style={{ color: '#A8A29E' }}>{getAnxietyLabel(day.log.anxiety_level)}</p>
          </div>
        </div>

        {day.log.notes && (
          <p className="text-sm italic leading-relaxed rounded-xl px-4 py-3"
            style={{ background: '#D8EBCF', color: '#78716C', borderRight: `3px solid ${mc}60` }}>
            "{day.log.notes}"
          </p>
        )}

        {symptoms.length > 0 && (
          <div>
            <p className="label flex items-center gap-1.5 mb-3">
              <Activity className="w-3 h-3" /> {symptoms.length} أعراض
            </p>
            <div className="space-y-2">
              {[...symptoms].sort((a, b) => a.hour_of_day - b.hour_of_day).map(s => {
                const preset = SYMPTOM_PRESETS.find(p => p.label === s.symptom_type);
                return (
                  <div key={s.id} className="flex items-center gap-2.5 text-sm">
                    <span className="text-xs font-bold w-10" style={{ color: '#A8A29E' }}>{formatHour(s.hour_of_day)}</span>
                    <span className="text-base leading-none">{preset?.icon || '●'}</span>
                    <span className="flex-1" style={{ color: '#78716C' }}>{s.symptom_type}</span>
                    <span className="text-xs font-bold" style={{
                      color: s.intensity >= 4 ? '#EF4444' : s.intensity >= 3 ? '#F97316' : '#22C55E',
                    }}>
                      {'■'.repeat(s.intensity)}{'□'.repeat(5 - s.intensity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function History() {
  const [allDays, setAllDays]           = useState([]);
  const [selectedDay, setSelectedDay]   = useState(null);
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

  const monthName      = arDate(firstOfMonth, { month: 'long', year: 'numeric' });
  const isCurrentMonth = currentMonth.year === new Date().getFullYear() && currentMonth.month === new Date().getMonth();
  const loggedCount    = calendarCells.filter(c => c?.log).length;

  const goMonth = (offset) => {
    setCurrentMonth(m => {
      const d = new Date(m.year, m.month + offset, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    setSelectedDay(null);
  };

  return (
    <div className="space-y-5">
      <h1 className="page-header pt-2">السجل</h1>

      {/* Calendar */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => goMonth(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
            style={{ background: '#D8EBCF', color: '#78716C' }}>
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="text-center">
            <p className="font-extrabold" style={{ color: '#1C1917' }}>{monthName}</p>
            {loggedCount > 0 && (
              <p className="text-[10px] font-bold mt-0.5 uppercase tracking-widest" style={{ color: '#659287' }}>
                {loggedCount} يوم مسجل
              </p>
            )}
          </div>
          <button onClick={() => goMonth(1)} disabled={isCurrentMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-20"
            style={{ background: '#D8EBCF', color: '#78716C' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['ح','ن','ث','ر','خ','ج','س'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold py-1 uppercase tracking-wider"
              style={{ color: '#C4B8B0' }}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((day, i) => (
            <CalendarDay key={i} day={day}
              isSelected={selectedDay?.date === day?.date}
              onClick={d => { if (d.log) setSelectedDay(prev => prev?.date === d.date ? null : d); }}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 mt-5 text-[10px] flex-wrap" style={{ color: '#A8A29E' }}>
          <span className="font-bold uppercase tracking-widest">مزاج:</span>
          {[[2,'سيء'],[5,'جيد'],[8,'ممتاز'],[10,'رائع']].map(([n, l]) => (
            <span key={n} className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full" style={{ background: MOOD_COLORS[n] }} />
              {l}
            </span>
          ))}
        </div>
      </div>

      {selectedDay?.log && (
        <DayDetail day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}

      {/* Full list */}
      <div>
        <p className="font-extrabold mb-3" style={{ color: '#1C1917' }}>جميع الأيام</p>
        {allDays.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#A8A29E' }}>
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm">لا توجد أيام مسجلة</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {allDays.map(day => (
              <Link key={day.id} to={`/log/${day.date}`}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all hover:bg-black/[0.02]"
                style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: MOOD_COLORS[day.mood_rating] + '15' }}>
                  {MOOD_EMOJIS[day.mood_rating]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: '#1C1917' }}>
                    {arDate(new Date(day.date + 'T12:00:00'), { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="h-1 w-16 rounded-full overflow-hidden" style={{ background: '#D8EBCF' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${day.mood_rating * 10}%`, background: MOOD_COLORS[day.mood_rating] }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: MOOD_COLORS[day.mood_rating] }}>{day.mood_rating}</span>
                    <span className="text-[10px]" style={{ color: '#C4B8B0' }}>قلق</span>
                    <span className="text-xs font-bold" style={{ color: ANXIETY_COLORS[day.anxiety_level] }}>{day.anxiety_level}</span>
                  </div>
                </div>
                {day.symptom_count > 0 && (
                  <span className="badge text-[10px] flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                    {day.symptom_count} أعراض
                  </span>
                )}
                <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C4B8B0' }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
