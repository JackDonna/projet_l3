const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'rdp.dptinfo-usmb.fr',
    port: 3306,
    user: 'app',
    password: 'POecfwI((xAEmA!T',
    database: 'test_RPA'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected to the database');
});

module.exports = connection;