const pool = require("../database/db.js");
const axios = require("axios");
const utils = require("../utils/ics_utils");
const fs = require("fs");
const ical = require("ical");
const {start} = require("repl");
const config = JSON.parse(fs.readFileSync("controllers/utils/color_config.json", 'utf8'));
const colors = config.colors;
const sql_config = JSON.parse(fs.readFileSync("controllers/config/sql_config.json", "utf-8"));
const SQL = sql_config.sql;


// -------------------------------------------------- SUBS FUNCTIONS ------------------------------------------------ //


// ---------------------------------------------------- MAINS FUNCTIONS --------------------------------------------- //

// --------------------------------------------------- EXPORTS ------------------------------------------------------ //