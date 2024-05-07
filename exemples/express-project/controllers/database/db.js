const mysql = require('mysql');
const fs = require("fs");
const conf = JSON.parse(fs.readFileSync("controllers/config/db_config.json", "utf-8"));

module.exports = mysql.createPool(conf);