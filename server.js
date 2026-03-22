const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// DATABASE CONNECTION
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// CREATE TABLE
pool.query(`
    CREATE TABLE IF NOT EXISTS contact_us (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    )
`).then(() => console.log('Table ready!'))
  .catch(err => console.log('Table error:', err.message));

// HOMEPAGE
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// HANDLE FORM
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await pool.query(
            'INSERT INTO contact_us (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );
        res.json({ success: true });
    } catch(err) {
        console.log('Insert error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
