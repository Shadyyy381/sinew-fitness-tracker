const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();
const VALID_TYPES = ["walk", "water", "sleep"];

router.use(requireAuth);

// Create a log entry
router.post("/", async (req, res) => {
  const { type, value, logged_at } = req.body;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: "Type must be one of: walk, water, sleep." });
  }
  const numericValue = Number(value);
  if (!numericValue || numericValue <= 0) {
    return res.status(400).json({ error: "Value must be a positive number." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO logs (user_id, type, value, logged_at)
       VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE))
       RETURNING id, type, value, logged_at`,
      [req.userId, type, numericValue, logged_at || null]
    );
    res.status(201).json({ log: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save that entry." });
  }
});

// List recent logs, optionally filtered by type, most recent first
router.get("/", async (req, res) => {
  const { type, days = 30 } = req.query;
  const params = [req.userId, Number(days) || 30];
  let query = `
    SELECT id, type, value, logged_at
    FROM logs
    WHERE user_id = $1 AND logged_at >= CURRENT_DATE - ($2 || ' days')::interval
  `;
  if (type) {
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: "Invalid type filter." });
    }
    params.push(type);
    query += ` AND type = $3`;
  }
  query += " ORDER BY logged_at DESC, created_at DESC";

  try {
    const result = await pool.query(query, params);
    res.json({ logs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load entries." });
  }
});

// Delete a log entry (only if it belongs to the caller)
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM logs WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Entry not found." });
    }
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete that entry." });
  }
});

// Daily totals per type for the last N days, for the dashboard charts
router.get("/summary/weekly", async (req, res) => {
  const days = Number(req.query.days) || 7;
  try {
    const result = await pool.query(
      `SELECT logged_at, type, SUM(value)::float AS total
       FROM logs
       WHERE user_id = $1 AND logged_at >= CURRENT_DATE - ($2 || ' days')::interval
       GROUP BY logged_at, type
       ORDER BY logged_at ASC`,
      [req.userId, days]
    );

    const todayResult = await pool.query(
      `SELECT type, SUM(value)::float AS total
       FROM logs
       WHERE user_id = $1 AND logged_at = CURRENT_DATE
       GROUP BY type`,
      [req.userId]
    );

    res.json({ history: result.rows, today: todayResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load summary." });
  }
});

module.exports = router;
