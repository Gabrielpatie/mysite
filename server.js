const express = require('express');
const mysql   = require('mysql2');
const app     = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// DATABASE CONNECTION
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'noticeboard_db'
});

db.connect((err) => {
    if (err) {
        console.log('Database error:', err);
    } else {
        console.log('Database connected!');
    }
});

// CREATE TABLE IF NOT EXISTS
db.query(`
    CREATE TABLE IF NOT EXISTS contact_us (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) console.log('Table error:', err);
    else console.log('Table ready!');
});

// HANDLE FORM SUBMISSION
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    const sql = 'INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err) => {
        if (err) {
            console.log('Insert error:', err);
            res.status(500).json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
