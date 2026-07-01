const express = require('express');
const router = express.Router();
const db = require('../db');

// GET symptoms for a day_id
router.get('/day/:dayId', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM symptoms WHERE day_id = ? ORDER BY hour_of_day ASC, created_at ASC',
      [req.params.dayId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET symptoms by date
router.get('/date/:date', async (req, res) => {
  try {
    const [days] = await db.query('SELECT id FROM days WHERE date = ?', [req.params.date]);
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

// POST add symptom
router.post('/', async (req, res) => {
  const { day_id, symptom_type, intensity, hour_of_day, notes } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO symptoms (day_id, symptom_type, intensity, hour_of_day, notes) VALUES (?, ?, ?, ?, ?)',
      [day_id, symptom_type, intensity, hour_of_day, notes]
    );
    const [row] = await db.query('SELECT * FROM symptoms WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update symptom
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

// DELETE symptom
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM symptoms WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
