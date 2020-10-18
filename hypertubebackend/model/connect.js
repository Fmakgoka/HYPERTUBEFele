var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "000000",
    database: "hypertube",
    multipleStatements: true
})

module.exports = con;