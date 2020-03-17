var mysql = require('mysql');

var con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bookbanktheory'
});

module.exports = con;