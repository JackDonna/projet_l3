const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'rdp.dptinfo-usmb.fr',
    port: 3306,
    user: 'app',
    password: 'POecfwI((xAEmA!T',
    database: 'test_RPA',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


module.exports = pool;