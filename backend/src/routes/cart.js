import express from 'express';
import pool from '../db.js';
const router = express.Router();

// Add to cart
router.post('/', async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    await pool.query('INSERT INTO cart (user_id, product_id) VALUES ($1, $2)', [user_id, product_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get cart items
router.get('/:user_id', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT p.* FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1', [req.params.user_id]);
    res.json(dbRes.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove from cart
router.delete('/:user_id/:product_id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [req.params.user_id, req.params.product_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
