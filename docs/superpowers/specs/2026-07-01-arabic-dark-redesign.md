# DayFlow — Arabic Dark Redesign Spec
**Date:** 2026-07-01  
**Status:** Approved

## Summary
Transform the existing DayFlow React app from a light English UI to a Dark & Modern Arabic RTL experience. No structural changes to the backend or API. All changes are confined to the frontend.

## Visual System

### Colors
| Role | Value |
|---|---|
| Page background | `#080C14` |
| Card surface | `#0F1623` |
| Input/secondary surface | `#161D2E` |
| Border | `rgba(255,255,255,0.07)` |
| Primary (violet) | `#7C3AED` |
| Accent (cyan) | `#06B6D4` |
| Good/low-anxiety | `#10B981` |
| Warning | `#F59E0B` |
| Danger/high-anxiety | `#EF4444` |
| Text primary | `#F1F5F9` |
| Text secondary | `#94A3B8` |
| Text muted | `#475569` |

### Glass Cards
```
background: rgba(15, 22, 35, 0.85)
backdrop-filter: blur(20px)
border: 1px solid rgba(255,255,255,0.07)
box-shadow: 0 8px 32px rgba(0,0,0,0.5)
border-radius: 1.25rem
```

### Typography
- Font: `Cairo` (Google Fonts) — supports Arabic + Latin
- Headings: weight 700–800
- Body: weight 400–500

### Page Gradients (hero headers)
- Dashboard: violet → indigo
- Daily Log: cyan → blue
- History: emerald → teal
- Insights: amber → orange

## RTL & Arabic

### HTML
- `<html dir="rtl" lang="ar">` on the root
- Tailwind `rtl:` variants where layout needs explicit mirroring

### Font import
```html
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

### Key Arabic Translations
| English | Arabic |
|---|---|
| DayFlow | يومفلو |
| Dashboard | الرئيسية |
| Log Today | سجّل اليوم |
| History | السجل |
| Insights | التحليلات |
| Mood Rating | تقييم المزاج |
| Anxiety Level | مستوى القلق |
| Sleep Hours | ساعات النوم |
| Daily Notes | ملاحظات اليوم |
| Save Day | حفظ اليوم |
| Symptom Timeline | جدول الأعراض |
| Add Symptom | إضافة عرض |
| Physical | جسدية |
| Mental | نفسية |
| Intensity | الشدة |
| Time | الوقت |
| Saved! | تم الحفظ! |
| Good morning | صباح الخير |
| Good afternoon | مساء الخير |
| Good evening | مساء النور |
| Amazing | رائع |
| Great | ممتاز |
| Good | جيد |
| Low | منخفض |
| Bad | سيء |
| Calm | هادئ |
| Mild | خفيف |
| Moderate | متوسط |
| High | مرتفع |
| Severe | شديد |
| Today | اليوم |
| Edit | تعديل |
| See all | عرض الكل |
| No data yet | لا توجد بيانات |
| Days logged | أيام مسجلة |
| Avg Mood | متوسط المزاج |
| Avg Anxiety | متوسط القلق |
| Avg Sleep | متوسط النوم |
| Total Symptoms | مجموع الأعراض |

### Symptom Presets (Arabic)
Heart Racing→تسارع القلب, Shortness of Breath→ضيق التنفس, Chest Tightness→ضيق في الصدر, Dizziness→دوخة, Sweating→تعرق, Trembling→رعشة, Nausea→غثيان, Headache→صداع, Muscle Tension→توتر عضلي, Fatigue→إرهاق, Brain Fog→ضباب ذهني, Intrusive Thoughts→أفكار متطفلة, Panic Attack→نوبة هلع, Overwhelmed→إرهاق نفسي, Restlessness→قلق حركي, Irritability→سرعة الانفعال, Concentration Issues→صعوبة التركيز, Social Anxiety→قلق اجتماعي

### Calendar Day Headers (short Arabic)
ح / ن / ث / ر / خ / ج / س

## Files to Change
1. `frontend/index.html` — dir=rtl, lang=ar, Cairo font, dark bg meta
2. `frontend/src/index.css` — dark Tailwind base, glass card utility, RTL scrollbar
3. `frontend/tailwind.config.js` — dark mode config, extend colors
4. `frontend/src/utils/helpers.js` — Arabic labels, symptom presets in Arabic, Arabic time formatting
5. `frontend/src/components/Navbar.jsx` — dark style, Arabic nav labels
6. `frontend/src/components/BottomNav.jsx` — dark style, Arabic labels
7. `frontend/src/components/Layout.jsx` — dark background wrapper
8. `frontend/src/pages/Dashboard.jsx` — dark cards, gradient header, Arabic text
9. `frontend/src/pages/DailyLog.jsx` — dark sliders, glow effects, Arabic text
10. `frontend/src/pages/History.jsx` — dark calendar, glowing mood dots, Arabic text
11. `frontend/src/pages/Insights.jsx` — dark charts, Arabic text

## Out of Scope
- Backend changes (none)
- New features (none)
- Route structure changes (none)
