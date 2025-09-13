const mysql = require('mysql2');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
require('dotenv').config();

const dbconnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
});

// dbconnection.execute('SELECT 1 + 1 AS solution', (err, results) => {
//     if (err) {
//         console.error('Error executing query:', err);
//         return;
//     }
//     console.log('Query results:', results);
// });

module.exports = dbconnection.promise();