// Import necessary modules
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // Optional, if you need to hash passwords
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'database-2.cvgio2aq09cd.ap-south-1.rds.amazonaws.com', // e.g., 'localhost' or the AWS RDS endpoint
    user: 'admin',
    password: 'Tamosa1985',
    database: 'it-department'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Define the /users route
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json(results);
    });
});

// Define the root route
app.get('/', (req, res) => {
    res.send('Welcome to the Department of Information Technology!');
});

// Define a POST route to handle login (example)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Fetch user from the database
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch user' });
        }

        if (results.length > 0) {
            const user = results[0];

            // Compare the hashed password (if using bcrypt)
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    res.json({ message: 'Login successful', user });
                } else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
