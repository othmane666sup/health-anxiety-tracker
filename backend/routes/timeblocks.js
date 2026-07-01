const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/date/:date', async (req, res) => {
  try {
    const [days] = await db.query(
      'SELECT id FROM days WHERE date = ? AND user_id = ?',
      [req.params.date, req.userId]
    );
    if (days.length === 0) return res.json([]);
    const [rows] = await db.query(
      'SELECT * FROM time_blocks WHERE day_id = ? ORDER BY hour ASC',
      [days[0].id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { day_id, hour, activity, quality, notes } = req.body;
  try {
    await db.query(
      `INSERT INTO time_blocks (day_id, hour, activity, quality, notes)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE activity=VALUES(activity), quality=VALUES(quality), notes=VALUES(notes)`,
      [day_id, hour, activity, quality, notes]
    );
    const [rows] = await db.query(
      'SELECT * FROM time_blocks WHERE day_id=? AND hour=?',
      [day_id, hour]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM time_blocks WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
