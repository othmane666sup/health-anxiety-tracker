import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { daysApi, symptomsApi, userSymptomsApi } from '../api';
import {
  MOOD_EMOJIS, ANXIETY_EMOJIS, MOOD_COLORS, ANXIETY_COLORS,
  SYMPTOM_PRESETS, INTENSITY_COLORS, formatHour, todayString, arDate,
} from '../utils/helpers';
import { Plus, X, Clock, ChevronLeft, ChevronRight, Check, Trash2 } from 'lucide-react';

/* Slider with dynamic thumb color via CSS variable */
function ColoredSlider({ value, min = 1, max = 10, color, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range" min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{
        background: `linear-gradient(to left, ${color} ${pct}%, #C0DABC ${pct}%)`,
        '--thumb-color': color,
        '--thumb-glow': color + '30',
      }}
    />
  );
}

/* Sleep quick-pick chips */
const SLEEP_CHIPS = [4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10];

function SleepPicker({ value, onChange }) {
  const num = Number(value);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {SLEEP_CHIPS.map(h => {
          const active = num === h;
          return (
            <button key={h} onClick={() => onChange(active ? '' : String(h))}
              className="py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: active ? '#659287' : '#D8EBCF',
                color:      active ? '#FFFFFF' : '#78716C',
                boxShadow:  active ? '0 2px 10px rgba(101,146,135,0.25)' : 'none',
              }}>
              {h}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-center font-bold uppercase tracking-widest" style={{ color: '#C4B8B0' }}>
        {value ? `${value} ساعة` : 'اختر عدد ساعات النوم'}
      </p>
    </div>
  );
}

/* Symptom modal */
function SymptomModal({ hour, onClose, onSave, userSymptoms = [] }) {
  const [type, setType]           = useState('');
  const [custom, setCustom]       = useState('');
  const [intensity, setIntensity] = useState(3);
  const [selHour, setSelHour]     = useState(hour ?? new Date().getHours());
  const [notes, setNotes]         = useState('');
  const [tab, setTab]             = useState('mine');

  const presetLabels = new Set(SYMPTOM_PRESETS.map(s => s.label));
  const mySymptoms   = userSymptoms.filter(s => !presetLabels.has(s.name));

  const finalType = type === '__custom__' ? custom.trim() : type;
  const canSave   = finalType.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="flex min-h-full items-end justify-center px-4 pb-24 pt-16">
      <div className="w-full max-w-sm overflow-hidden"
        style={{ background: '#FFFFFF', borderRadius: '1.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <h3 className="font-extrabold" style={{ color: '#1C1917' }}>إضافة عرض</h3>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl"
            style={{ background: '#D8EBCF', color: '#78716C' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[72vh] overflow-y-auto">
          <div>
            <label className="label flex items-center gap-1.5">
              <Clock className="w-3 h-3" style={{ color: '#659287' }} /> الوقت
            </label>
            <select value={selHour} onChange={e => setSelHour(Number(e.target.value))} className="input">
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{formatHour(i)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">العرض</label>
            <div className="flex gap-2 mb-3">
              {[
                ...(mySymptoms.length > 0 ? [['mine', '⭐ مستخدمة']] : []),
                ['physical', '🫀 جسدية'],
                ['mental', '🧠 نفسية'],
              ].map(([t, l]) => (
                <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                  style={tab === t
                    ? { background: 'rgba(101,146,135,0.1)', color: '#659287', border: '1.5px solid rgba(101,146,135,0.2)' }
                    : { background: '#D8EBCF', color: '#A8A29E', border: '1.5px solid transparent' }}>
                  {l}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {tab === 'mine' && mySymptoms.map(s => (
                <button key={s.name} onClick={() => { setType(s.name); setCustom(''); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-right"
                  style={type === s.name
                    ? { background: 'rgba(101,146,135,0.08)', color: '#659287', border: '1.5px solid rgba(101,146,135,0.18)' }
                    : { background: '#D8EBCF', color: '#78716C', border: '1.5px solid transparent' }}>
                  <span className="text-base leading-none">●</span>
                  <span className="truncate">{s.name}</span>
                </button>
              ))}
              {tab !== 'mine' && SYMPTOM_PRESETS.filter(s => s.category === tab).map(s => (
                <button key={s.label} onClick={() => { setType(s.label); setCustom(''); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-right"
                  style={type === s.label
                    ? { background: 'rgba(101,146,135,0.08)', color: '#659287', border: '1.5px solid rgba(101,146,135,0.18)' }
                    : { background: '#D8EBCF', color: '#78716C', border: '1.5px solid transparent' }}>
                  <span className="text-base leading-none">{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
              <button onClick={() => setType('__custom__')}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={type === '__custom__'
                  ? { background: 'rgba(101,146,135,0.08)', color: '#659287', border: '1.5px solid rgba(101,146,135,0.18)' }
                  : { background: '#D8EBCF', color: '#A8A29E', border: '1.5px solid transparent' }}>
                <Plus className="w-3.5 h-3.5" /> مخصص
              </button>
            </div>
            {type === '__custom__' && (
              <input className="input mt-2" placeholder="صف عرضك..."
                value={custom} onChange={e => setCustom(e.target.value)} autoFocus />
            )}
          </div>

          <div>
            <label className="label">الشدة</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setIntensity(n)}
                  className="flex-1 py-3 rounded-xl text-sm font-extrabold transition-all"
                  style={{
                    background: n <= intensity ? INTENSITY_COLORS[n] + '20' : '#D8EBCF',
                    color: n <= intensity ? INTENSITY_COLORS[n] : '#C4B8B0',
                    border: intensity === n ? `2px solid ${INTENSITY_COLORS[n]}` : '2px solid transparent',
                  }}>
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: '#C4B8B0' }}>
              <span>خفيف</span><span>شديد</span>
            </div>
          </div>

          <div>
            <label className="label">ملاحظات <span className="normal-case" style={{ color: '#C4B8B0' }}>(اختياري)</span></label>
            <textarea className="input resize-none" rows={2} placeholder="أي تفاصيل..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="p-4" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <button onClick={() => canSave && onSave({ symptom_type: finalType, intensity, hour_of_day: selHour, notes })}
            disabled={!canSave}
            className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed" style={{ gap: '0.5rem' }}>
            <Check className="w-4 h-4" /> حفظ العرض
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

function TimelineRow({ hour, symptoms, onAddClick, isLast }) {
  const isNow   = new Date().getHours() === hour;
  const hasItems = symptoms.length > 0;

  return (
    <div className="flex items-start gap-0 group">
      <div className="w-14 flex-shrink-0 text-right pt-2.5">
        <span className="text-xs font-bold" style={{ color: isNow ? '#659287' : '#C4B8B0' }}>
          {formatHour(hour)}
        </span>
      </div>
      <div className="flex flex-col items-center mx-4 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 transition-all"
          style={{
            background: (isNow || hasItems) ? '#659287' : '#E8E4DC',
            boxShadow: (isNow || hasItems) ? '0 0 0 3px rgba(101,146,135,0.15)' : 'none',
          }} />
        {!isLast && (
          <div className="w-px flex-1" style={{ background: 'rgba(0,0,0,0.07)', minHeight: hasItems ? 28 : 14 }} />
        )}
      </div>
      <div className="flex-1 pb-2 pt-0.5">
        <div className="flex flex-wrap gap-1.5 items-center">
          {symptoms.map(s => (
            <span key={s.id} className="badge text-[11px]"
              style={{ background: INTENSITY_COLORS[s.intensity] + '1A', color: INTENSITY_COLORS[s.intensity] }}>
              {SYMPTOM_PRESETS.find(p => p.label === s.symptom_type)?.icon || '●'} {s.symptom_type}
            </span>
          ))}
          <button onClick={() => onAddClick(hour)}
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${
              hasItems ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{ background: '#D8EBCF', color: '#A8A29E' }}>
            <Plus className="w-3 h-3" />
          </button>
        </div>
        {isNow && !hasItems && (
          <p className="text-[10px] font-bold mt-0.5" style={{ color: 'rgba(101,146,135,0.45)' }}>الآن</p>
        )}
      </div>
    </div>
  );
}

function SymptomItem({ symptom, onDelete }) {
  const preset = SYMPTOM_PRESETS.find(p => p.label === symptom.symptom_type);
  const color  = INTENSITY_COLORS[symptom.intensity];
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <span className="text-lg leading-none">{preset?.icon || '●'}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm" style={{ color: '#1C1917' }}>{symptom.symptom_type}</p>
        <p className="text-xs mt-0.5" style={{ color: '#A8A29E' }}>{formatHour(symptom.hour_of_day)}</p>
      </div>
      <div className="flex gap-1 items-center">
        {[1,2,3,4,5].map(n => (
          <div key={n} className="w-1.5 h-1.5 rounded-full"
            style={{ background: n <= symptom.intensity ? color : '#F0E8D0' }} />
        ))}
      </div>
      <button onClick={() => onDelete(symptom.id)}
        className="w-7 h-7 flex items-center justify-center rounded-xl transition-all"
        style={{ background: '#FEF2F2', color: '#FCA5A5' }}>
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function DailyLog() {
  const { date: paramDate } = useParams();
  const navigate            = useNavigate();
  const [date, setDate]     = useState(paramDate || todayString());
  const [dayData, setDayData]           = useState(null);
  const [symptoms, setSymptoms]         = useState([]);
  const [form, setForm]                 = useState({ mood_rating: 7, anxiety_level: 3, sleep_hours: '', notes: '' });
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [modalHour, setModalHour]       = useState(null);
  const [showAllHours, setShowAllHours] = useState(false);
  const [userSymptoms, setUserSymptoms] = useState([]);

  const load = useCallback(async (d) => {
    try {
      const [day, syms] = await Promise.all([
        daysApi.getByDate(d).catch(() => null),
        symptomsApi.getByDate(d),
      ]);
      if (day) {
        setDayData(day);
        setForm({ mood_rating: day.mood_rating, anxiety_level: day.anxiety_level,
          sleep_hours: day.sleep_hours ?? '', notes: day.notes ?? '' });
      } else {
        setDayData(null);
        setForm({ mood_rating: 7, anxiety_level: 3, sleep_hours: '', notes: '' });
      }
      setSymptoms(syms);
    } catch {}
  }, []);

  useEffect(() => { load(date); }, [date, load]);
  useEffect(() => { userSymptomsApi.getAll().then(setUserSymptoms).catch(() => {}); }, []);

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
    userSymptomsApi.getAll().then(setUserSymptoms).catch(() => {});
    setModalHour(null);
  };

  const handleDeleteSymptom = async (id) => {
    await symptomsApi.remove(id);
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const isToday        = date === todayString();
  const currentHour    = new Date().getHours();
  const symptomsByHour = {};
  symptoms.forEach(s => {
    if (!symptomsByHour[s.hour_of_day]) symptomsByHour[s.hour_of_day] = [];
    symptomsByHour[s.hour_of_day].push(s);
  });

  const allHours   = Array.from({ length: 24 }, (_, i) => i);
  const smartHours = allHours.filter(h =>
    symptoms.some(s => s.hour_of_day === h) || (isToday && Math.abs(h - currentHour) <= 4)
  );
  const displayHours = showAllHours
    ? allHours
    : (smartHours.length > 0 ? smartHours : Array.from({ length: 9 }, (_, i) => i + 8));

  const moodColor = MOOD_COLORS[form.mood_rating];
  const anxColor  = ANXIETY_COLORS[form.anxiety_level];

  return (
    <div className="space-y-5">

      {/* Date navigator */}
      <div className="flex items-center gap-4">
        <button onClick={() => handleDateChange(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-all"
          style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)', color: '#78716C',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center">
          <p className="font-extrabold" style={{ color: '#1C1917' }}>
            {isToday ? 'اليوم' : arDate(new Date(date + 'T12:00:00'), { weekday: 'long' })}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#A8A29E' }}>
            {arDate(new Date(date + 'T12:00:00'), { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => handleDateChange(1)} disabled={date >= todayString()}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-all disabled:opacity-25"
          style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)', color: '#78716C',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Ratings card */}
      <div className="card space-y-7">
        <h2 className="font-extrabold" style={{ color: '#1C1917' }}>كيف كان يومك؟</h2>

        {/* Mood */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label mb-0.5">تقييم المزاج</p>
              <p className="text-xs" style={{ color: '#A8A29E' }}>كم كنت سعيداً اليوم؟</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-3xl leading-none">{MOOD_EMOJIS[form.mood_rating]}</span>
              <span className="font-extrabold text-3xl leading-none" style={{ color: moodColor }}>
                {form.mood_rating}
              </span>
              <span className="text-sm font-bold" style={{ color: '#C4B8B0' }}>/10</span>
            </div>
          </div>
          <ColoredSlider value={form.mood_rating} color={moodColor}
            onChange={v => setForm(f => ({ ...f, mood_rating: v }))} />
          <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: '#C4B8B0' }}>
            <span>سيء</span><span>رائع</span>
          </div>
        </div>

        {/* Anxiety */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label mb-0.5">مستوى القلق</p>
              <p className="text-xs" style={{ color: '#A8A29E' }}>كم كان قلقك اليوم؟</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-3xl leading-none">{ANXIETY_EMOJIS[form.anxiety_level]}</span>
              <span className="font-extrabold text-3xl leading-none" style={{ color: anxColor }}>
                {form.anxiety_level}
              </span>
              <span className="text-sm font-bold" style={{ color: '#C4B8B0' }}>/10</span>
            </div>
          </div>
          <ColoredSlider value={form.anxiety_level} color={anxColor}
            onChange={v => setForm(f => ({ ...f, anxiety_level: v }))} />
          <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: '#C4B8B0' }}>
            <span>هادئ</span><span>شديد</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }} />

        {/* Sleep */}
        <div>
          <label className="label">ساعات النوم</label>
          <SleepPicker value={form.sleep_hours} onChange={v => setForm(f => ({ ...f, sleep_hours: v }))} />
        </div>

        {/* Notes */}
        <div>
          <label className="label">ملاحظات اليوم</label>
          <textarea className="input resize-none" rows={3}
            placeholder="كيف تشعر؟ ماذا حدث اليوم؟ أي مثيرات؟"
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full"
          style={saved ? { background: '#22C55E', boxShadow: '0 4px 16px rgba(34,197,94,0.25)' } : {}}>
          {saving
            ? <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/30 border-t-white" />
            : saved
              ? <><Check className="w-4 h-4 inline ml-1" /> تم الحفظ!</>
              : 'حفظ اليوم'
          }
        </button>
      </div>

      {/* Symptom timeline */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-extrabold" style={{ color: '#1C1917' }}>جدول الأعراض</h2>
            <p className="text-xs mt-0.5" style={{ color: '#A8A29E' }}>
              {symptoms.length > 0 ? `${symptoms.length} عرض مسجل` : 'لا توجد أعراض بعد'}
            </p>
          </div>
          <button onClick={() => setModalHour(currentHour)} className="btn-primary gap-1.5 text-sm px-4 py-2">
            <Plus className="w-3.5 h-3.5" /> إضافة
          </button>
        </div>

        <div className="timeline-line">
          {displayHours.map((hour, idx) => (
            <TimelineRow key={hour} hour={hour} symptoms={symptomsByHour[hour] || []}
              onAddClick={setModalHour} isLast={idx === displayHours.length - 1} />
          ))}
        </div>

        <button onClick={() => setShowAllHours(v => !v)}
          className="mt-3 w-full text-center text-[10px] font-bold uppercase tracking-widest py-1 transition-colors"
          style={{ color: '#C4B8B0' }}>
          {showAllHours ? '▲ عرض أقل' : '▼ عرض 24 ساعة'}
        </button>
      </div>

      {symptoms.length > 0 && (
        <div>
          <p className="font-extrabold mb-3" style={{ color: '#1C1917' }}>جميع الأعراض</p>
          <div className="space-y-2">
            {[...symptoms].sort((a, b) => a.hour_of_day - b.hour_of_day).map(s => (
              <SymptomItem key={s.id} symptom={s} onDelete={handleDeleteSymptom} />
            ))}
          </div>
        </div>
      )}

      {modalHour !== null && (
        <SymptomModal hour={modalHour} onClose={() => setModalHour(null)} onSave={handleAddSymptom} userSymptoms={userSymptoms} />
      )}
    </div>
  );
}
