const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql2');
const path=require('path'); // Assuming you're using MySQL

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
const port = 8080;

// Create a connection to the database
const db = mysql.createConnection({
  host: 'database-2.cvgio2aq09cd.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Tamosa1985',
  database: 'it_department'
});
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.query(sql, [username, hashedPassword], (err, result) => {
    if (err) throw err;
    res.send('User registered');
  });
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
  db.query('SELECT * FROM faculty', (err, results) => {
      if (err) {
          console.error("Error fetching users:", err); // Debugging line
          return res.status(500).json({ error: 'Failed to fetch users' });
      }
      res.json(results);
  });
});

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'))
});

// Start the server
app.listen(8080, () => {
  console.log(`Server running on port ${port}`);
});
