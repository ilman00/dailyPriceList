const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'daily_price_list',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;