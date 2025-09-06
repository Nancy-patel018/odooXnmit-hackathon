import express from 'express';
import pool from '../db.js';
import multer from 'multer';
import cloudinary from 'cloudinary';

const router = express.Router();

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: 'uploads/' });

// Create product
router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, category, price, user_id } = req.body;
  let imageUrl = '';
  try {
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }
    const dbRes = await pool.query(
      'INSERT INTO products (title, description, category, price, image, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, category, price, imageUrl, user_id]
    );
    res.status(201).json(dbRes.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products (with optional category and search)
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM products';
  let params = [];
  if (category) {
    query += ' WHERE category = $1';
    params.push(category);
  }
  if (search) {
    query += params.length ? ' AND' : ' WHERE';
    query += ` title ILIKE $${params.length + 1}`;
    params.push(`%${search}%`);
  }
  try {
    const dbRes = await pool.query(query, params);
    res.json(dbRes.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (dbRes.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(dbRes.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const { title, description, category, price } = req.body;
  try {
    const dbRes = await pool.query(
      'UPDATE products SET title = $1, description = $2, category = $3, price = $4 WHERE id = $5 RETURNING *',
      [title, description, category, price, req.params.id]
    );
    res.json(dbRes.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
