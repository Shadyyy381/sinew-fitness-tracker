const { Pool } = require("pg");

// DATABASE_URL example: postgres://user:password@host:5432/sinew
// Render/Railway/Supabase Postgres instances usually require SSL in production.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
});

module.exports = pool;
