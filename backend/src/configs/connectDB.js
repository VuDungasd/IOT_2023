const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    // database: 'nhandien',
    database: 'IOT_2023',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.query(
    'SELECT * FROM nhandien.sensor',
    function (err, results, fields) {
        console.log(">>>results= ", results); // results contains rows returned by server
        console.log(">>>fields= ", fields); // fields contains extra meta data about results, if available
    }
);

module.exports = {
    pool
};