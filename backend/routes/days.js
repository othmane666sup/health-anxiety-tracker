const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, COUNT(s.id) as symptom_count
       FROM days d
       LEFT JOIN symptoms s ON s.day_id = d.id
       WHERE d.user_id = ?
       GROUP BY d.id
       ORDER BY d.date DESC
       LIMIT 90`,
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:date', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM days WHERE date = ? AND user_id = ?',
      [req.params.date, req.userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { date, mood_rating, anxiety_level, sleep_hours, notes } = req.body;
  try {
    const [existing] = await db.query(
      'SELECT id FROM days WHERE date = ? AND user_id = ?',
      [date, req.userId]
    );
    if (existing.length > 0) {
      await db.query(
        'UPDATE days SET mood_rating=?, anxiety_level=?, sleep_hours=?, notes=? WHERE date=? AND user_id=?',
        [mood_rating, anxiety_level, sleep_hours, notes, date, req.userId]
      );
      const [updated] = await db.query(
        'SELECT * FROM days WHERE date = ? AND user_id = ?',
        [date, req.userId]
      );
      return res.json(updated[0]);
    }
    const [result] = await db.query(
      'INSERT INTO days (date, mood_rating, anxiety_level, sleep_hours, notes, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [date, mood_rating, anxiety_level, sleep_hours, notes, req.userId]
    );
    const [newRow] = await db.query('SELECT * FROM days WHERE id = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM days WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
