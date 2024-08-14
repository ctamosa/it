const express = require('express');
const mysql = require('mysql'); // Assuming you're using MySQL

const app = express();
const port = 8080;

// Create a connection to the database
const db = mysql.createConnection({
  host: 'database-2.cvgio2aq09cd.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Tamosa1985',
  database: 'faculty'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// Define the route
app.get('/users', (req, res) => {
  console.log("GET /users route accessed"); // Debugging line
  db.query('SELECT * FROM users', (err, results) => {
      if (err) {
          console.error("Error fetching users:", err); // Debugging line
          return res.status(500).json({ error: 'Failed to fetch users' });
      }
      res.json(results);
  });
});

// Start the server
app.listen(8080, () => {
  console.log(`Server running on port ${port}`);
});
