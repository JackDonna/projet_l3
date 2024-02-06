const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'rdp.dptinfo-usmb.fr',
    port: 3306,
    user: 'app',
    password: 'POecfwI((xAEmA!T',
    database: 'test_RPA',
    connectionLimit : 10,
});

const connection = mysql.createConnection({
    host: 'rdp.dptinfo-usmb.fr',
    port: 3306,
    user: 'app',
    password: 'POecfwI((xAEmA!T',
    database: 'test_RPA',
});

connection.connect((err) => {
    if(err) throw err;
    console.log("connected")
});


module.exports = pool;