const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hsrokz786',
  database: 'testdb',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve HTML form to create tables
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Handle form submission to create tables
app.post('/create-table', (req, res) => {
  const tableName = req.body.tableName;
  const columns = Object.values(req.body).filter((val) => val !== tableName);

  const createTableQuery = `CREATE TABLE ${tableName} (${columns.map((col) => `${col} VARCHAR(255)`).join(', ')})`;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
      res.send('Error creating table');
    } else {
      console.log('Table created successfully');
      res.redirect('/');
    }
  });
});

// Add these routes to the existing index.js file
app.get('/tables', (req, res) => {
  const showTablesQuery = 'SHOW TABLES';

  db.query(showTablesQuery, (err, result) => {
      if (err) {
          console.error('Error fetching tables:', err);
          res.send('Error fetching tables');
          return;
      }

      const tables = result.map(row => row[`Tables_in_${db.config.database}`]);
      res.json(tables);
  });
});

app.get('/table-details/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  const showColumnsQuery = `SHOW COLUMNS FROM ${tableName}`;

  db.query(showColumnsQuery, (err, result) => {
      if (err) {
          console.error('Error fetching columns:', err);
          res.send('Error fetching columns');
          return;
      }

      const columns = result.map(row => row.Field);
      res.json(columns);
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
