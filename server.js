// const express = require('express');
// const bodyParser = require('body-parser');
// const db = require('./db.js');
// const path = require('path');
// const app = express();
// const port = 3000;

// // Set EJS as the templating engine
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));



// // Route to render the chart
// app.get('/', (req, res) => {
//   const query = 'SELECT * FROM i3_app_users';
//   db.query(query, (err, results) => {
//     if (err) throw err;
//     const labels = results.map(row => row.label);
//     const values = results.map(row => row.value);
//     res.render('index', { labels, values });
//   });
// });
// app.get("/web/admin/analytics", (req, res) => {
//     // const sql = 'SELECT createAt FROM i3_app_users';
//     // db.query(sql, (err, results) => {
//     //     if (err) {
//     //         res.status(500).send('Database Error');
//     //     } else {
//     //         res.json(results);
//     //     }
//     // });
//     // console.log("apiiii")
//   res.render("user-stats", { data: getUserStats() });
// });

// function getUserStats() {
//   return {
//     monthlyUsers: [100, 500, 200, 300, 100, 50, 600, 150, 400, 300, 200, 100],
//     userAnalytics: {
//       totalUsers: 1000,
//       subscription: 800,
//       trial: 200,
//       unlimited: 150,
//     },
//   };
// }
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const { resourceLimits } = require('worker_threads');
const { error } = require('console');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'esearch_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('MySQL Connected...');
});

app.get(['/api/data', '/api/fetchData'], (req, res) => {
  const year = req.query.year;
  console.log("year=======", year);
  
  // Default query to get data for all years
  let query = `
      SELECT YEAR(createdAt) AS year, MONTH(createdAt) AS month, COUNT(*) AS count 
   FROM i3_app_users 
      GROUP BY YEAR(createdAt) 
      ORDER BY year
  `;

  // Modify query if 'year' is provided
  if (year) {
       query = `
      SELECT YEAR(createdAt) AS year, MONTH(createdAt) AS month, COUNT(*) AS count 
      FROM i3_app_users 
      WHERE YEAR(createdAt) = ? 
      GROUP BY YEAR(createdAt), MONTH(createdAt) 
      ORDER BY year, month
  `;
  }

  // Execute the query
  db.query(query, year, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Server error');
      console.log(err)
      return;
    }

    // Normalize results to an array if needed
    const normalizedResults = Array.isArray(results) ? results : [results];
    
    const resp = normalizedResults.map(row => ({
      year: row.year,
      count: row.count,
      month: row.month,
    }));

    console.log('resp=====', resp);

    // Respond differently based on the route
    if (req.path === '/api/fetchData') {
      res.json(resp); // Respond with JSON for '/api/fetchData'
    } else {
      res.render('user-stats', { result: resp }); // Render for '/api/data'
    }
  });
});

app.get("/", (req, res) => {
  res.render("user-stats");
});


//   app.get('/api/fetchData',(req, res) => {
//   const year = req.query.year;
//   console.log("year=======",year)
//   // try {
//       let query = `
//           SELECT YEAR(createdAt) AS year, MONTH(createdAt) AS month, COUNT(*) AS count  FROM i3_app_users GROUP BY YEAR(createdAt) ORDER BY year
//       `;
//       if (year) {
//           query = `
//           SELECT YEAR(createdAt) AS year, MONTH(createdAt) AS month, COUNT(*) AS count FROM i3_app_users WHERE YEAR(createdAt) = ? GROUP BY YEAR(createdAt), MONTH(createdAt) ORDER BY year, month`;

//               // SELECT YEAR(createdAt) AS year, COUNT(*) AS count FROM i3_app_users  WHERE YEAR(createdAt) = ?   GROUP BY YEAR(createdAt) ORDER BY year `; 
//       }  
//       // const [rows] = await db.query(query, [year]);
//     db.query(query, year,( err, results) => {
//          if (err) { console.error('Error executing query:', err.stack); 
//           res.status(500).send('Server error'); return;
//          } 
//          // Normalize to array if needed
//          const normalizedResults = Array.isArray(results) ? results : [results];
//          const resp = normalizedResults.map(row => ({
//              year: row.year,
//              count: row.count,
//              month: row.month,
//          }));
     
//          console.log('resp=====', resp);
//         //  res.render('user-stats', { result:resp});
//         res.json(resp);
//           // res.json(results);
// });
// });   


//   app.get("/", (req, res ) =>{
//   // res.render ("new.ejs")
//   res.render("user-stats")
// });



app.listen(3000, () => {
  console.log('Server running on port 3000');
});