const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: 'database-2.cvgio2aq09cd.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Tamosa1985',
  database: 'it_department'
});

db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM faculty WHERE username = ?', [username], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).json({ message: 'Username not found' });
    }

    const faculty = results[0];

    bcrypt.compare(password, faculty.password, (err, isMatch) => {
      if (err) throw err;

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const token = jwt.sign({ id: faculty.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ message: 'Login successful', token });
    });
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
