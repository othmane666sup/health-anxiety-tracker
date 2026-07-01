const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/summary', async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  try {
    const [summary] = await db.query(
      `SELECT
        AVG(mood_rating) as avg_mood,
        AVG(anxiety_level) as avg_anxiety,
        AVG(sleep_hours) as avg_sleep,
        COUNT(*) as days_logged,
        MAX(mood_rating) as best_mood,
        MIN(anxiety_level) as lowest_anxiety
       FROM days
       WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`,
      [req.userId, days]
    );
    const [symptomCount] = await db.query(
      `SELECT COUNT(s.id) as total
       FROM symptoms s
       JOIN days d ON s.day_id = d.id
       WHERE d.user_id = ? AND d.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`,
      [req.userId, days]
    );
    res.json({ ...summary[0], total_symptoms: symptomCount[0].total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trend', async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  try {
    const [rows] = await db.query(
      `SELECT d.date, d.mood_rating, d.anxiety_level, d.sleep_hours, COUNT(s.id) as symptom_count
       FROM days d
       LEFT JOIN symptoms s ON s.day_id = d.id
       WHERE d.user_id = ? AND d.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY d.id
       ORDER BY d.date ASC`,
      [req.userId, days]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/top-symptoms', async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  try {
    const [rows] = await db.query(
      `SELECT s.symptom_type, COUNT(*) as count, AVG(s.intensity) as avg_intensity
       FROM symptoms s
       JOIN days d ON s.day_id = d.id
       WHERE d.user_id = ? AND d.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY s.symptom_type
       ORDER BY count DESC
       LIMIT 10`,
      [req.userId, days]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/hour-distribution', async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  try {
    const [rows] = await db.query(
      `SELECT s.hour_of_day, COUNT(*) as count, AVG(s.intensity) as avg_intensity
       FROM symptoms s
       JOIN days d ON s.day_id = d.id
       WHERE d.user_id = ? AND d.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY s.hour_of_day
       ORDER BY s.hour_of_day ASC`,
      [req.userId, days]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
