import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT id, email, username FROM users WHERE id = $1', [req.params.id]);
    if (dbRes.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(dbRes.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  const { username, email } = req.body;
  try {
    const dbRes = await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, email, username',
      [username, email, req.params.id]
    );
    res.json(dbRes.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
