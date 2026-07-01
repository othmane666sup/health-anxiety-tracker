const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/day/:dayId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.* FROM symptoms s
       JOIN days d ON s.day_id = d.id
       WHERE s.day_id = ? AND d.user_id = ?
       ORDER BY s.hour_of_day ASC, s.created_at ASC`,
      [req.params.dayId, req.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/date/:date', async (req, res) => {
  try {
    const [days] = await db.query(
      'SELECT id FROM days WHERE date = ? AND user_id = ?',
      [req.params.date, req.userId]
    );
    if (days.length === 0) return res.json([]);
    const [rows] = await db.query(
      'SELECT * FROM symptoms WHERE day_id = ? ORDER BY hour_of_day ASC',
      [days[0].id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { day_id, symptom_type, intensity, hour_of_day, notes, emoji } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO symptoms (day_id, symptom_type, intensity, hour_of_day, notes) VALUES (?, ?, ?, ?, ?)',
      [day_id, symptom_type, intensity, hour_of_day, notes]
    );
    await db.query(
      `INSERT INTO user_symptoms (user_id, name, emoji) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE use_count = use_count + 1, emoji = COALESCE(VALUES(emoji), emoji)`,
      [req.userId, symptom_type, emoji || null]
    );
    const [row] = await db.query('SELECT * FROM symptoms WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { symptom_type, intensity, hour_of_day, notes } = req.body;
  try {
    await db.query(
      'UPDATE symptoms SET symptom_type=?, intensity=?, hour_of_day=?, notes=? WHERE id=?',
      [symptom_type, intensity, hour_of_day, notes, req.params.id]
    );
    const [row] = await db.query('SELECT * FROM symptoms WHERE id = ?', [req.params.id]);
    res.json(row[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM symptoms WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
