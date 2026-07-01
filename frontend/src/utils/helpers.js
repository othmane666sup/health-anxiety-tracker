export const MOOD_EMOJIS = ['', '😰','😟','😕','😐','🙂','😊','😀','😁','🤩','🥳'];
export const ANXIETY_EMOJIS = ['', '😌','🙂','😐','😕','😟','😰','😥','😨','😱','💀'];

/* Mood: 1=red → 10=gold (best day = golden) */
export const MOOD_COLORS = {
  1:  '#F87171',
  2:  '#FB923C',
  3:  '#FBBF24',
  4:  '#FCD34D',
  5:  '#A3E635',
  6:  '#4ADE80',
  7:  '#34D399',
  8:  '#2DD4BF',
  9:  '#60A5FA',
  10: '#F0B429',
};

/* Anxiety: 1=calm green → 10=deep red */
export const ANXIETY_COLORS = {
  1:  '#34D399',
  2:  '#4ADE80',
  3:  '#A3E635',
  4:  '#FCD34D',
  5:  '#FBBF24',
  6:  '#FB923C',
  7:  '#F97316',
  8:  '#EF4444',
  9:  '#DC2626',
  10: '#991B1B',
};

export const INTENSITY_COLORS = {
  1: '#86efac', 2: '#4ade80', 3: '#fbbf24', 4: '#f97316', 5: '#ef4444',
};

export const SYMPTOM_PRESETS = [
  { label: 'تسارع القلب',    icon: '💓', category: 'physical' },
  { label: 'ضيق التنفس',     icon: '😮‍💨', category: 'physical' },
  { label: 'ضيق في الصدر',   icon: '🫁', category: 'physical' },
  { label: 'دوخة',           icon: '💫', category: 'physical' },
  { label: 'تعرق',           icon: '💧', category: 'physical' },
  { label: 'رعشة',           icon: '🫨', category: 'physical' },
  { label: 'غثيان',          icon: '🤢', category: 'physical' },
  { label: 'صداع',           icon: '🤕', category: 'physical' },
  { label: 'توتر عضلي',      icon: '💪', category: 'physical' },
  { label: 'إرهاق',          icon: '😴', category: 'physical' },
  { label: 'ضباب ذهني',      icon: '🌫️', category: 'mental' },
  { label: 'أفكار متطفلة',   icon: '🌀', category: 'mental' },
  { label: 'نوبة هلع',       icon: '🚨', category: 'mental' },
  { label: 'إرهاق نفسي',     icon: '🌊', category: 'mental' },
  { label: 'قلق حركي',       icon: '🏃', category: 'mental' },
  { label: 'سرعة الانفعال',  icon: '😤', category: 'mental' },
  { label: 'صعوبة التركيز',  icon: '🎯', category: 'mental' },
  { label: 'قلق اجتماعي',    icon: '👥', category: 'mental' },
];

/* Replace Arabic-Indic digits ٠١٢٣ with Latin 0123 — works on all browsers */
function latinDigits(str) {
  return str.replace(/[٠-٩]/g, d => d.charCodeAt(0) - 0x0660);
}

/* Safe Arabic date formatter — uses ar-SA (universally supported) + manual digit swap */
export function arDate(date, options) {
  if (!(date instanceof Date) || isNaN(date)) return '';
  return latinDigits(date.toLocaleDateString('ar-SA', options));
}

export function formatHour(h) {
  if (h === 0)  return '12 ص';
  if (h < 12)  return `${h} ص`;
  if (h === 12) return '12 م';
  return `${h - 12} م`;
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
  return arDate(d, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'صباح الخير';
  if (h < 17) return 'مساء الخير';
  return 'مساء النور';
}
