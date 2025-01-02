const mysql = require('mysql');


const db = mysql.createConnection({
    host: 'localhost',        
    user: 'root',             
    password: '',     
    database: 'esearch_db'  , 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database.');
});


module.exports = db;