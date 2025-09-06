import express from 'express';
import pool from '../db.js';
const router = express.Router();

// Add purchase
router.post('/', async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    await pool.query('INSERT INTO purchases (user_id, product_id) VALUES ($1, $2)', [user_id, product_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get previous purchases
router.get('/:user_id', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT p.* FROM purchases pu JOIN products p ON pu.product_id = p.id WHERE pu.user_id = $1', [req.params.user_id]);
    res.json(dbRes.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
