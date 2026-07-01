const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all days (recent 90)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*,
        COUNT(s.id) as symptom_count
       FROM days d
       LEFT JOIN symptoms s ON s.day_id = d.id
       GROUP BY d.id
       ORDER BY d.date DESC
       LIMIT 90`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single day by date (YYYY-MM-DD)
router.get('/:date', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM days WHERE date = ?', [req.params.date]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create or update a day
router.post('/', async (req, res) => {
  const { date, mood_rating, anxiety_level, sleep_hours, notes } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM days WHERE date = ?', [date]);
    if (existing.length > 0) {
      await db.query(
        'UPDATE days SET mood_rating=?, anxiety_level=?, sleep_hours=?, notes=? WHERE date=?',
        [mood_rating, anxiety_level, sleep_hours, notes, date]
      );
      const [updated] = await db.query('SELECT * FROM days WHERE date = ?', [date]);
      return res.json(updated[0]);
    }
    const [result] = await db.query(
      'INSERT INTO days (date, mood_rating, anxiety_level, sleep_hours, notes) VALUES (?, ?, ?, ?, ?)',
      [date, mood_rating, anxiety_level, sleep_hours, notes]
    );
    const [newRow] = await db.query('SELECT * FROM days WHERE id = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a day
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM days WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
