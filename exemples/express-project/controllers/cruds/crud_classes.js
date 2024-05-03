const pool = require("../database/db");
const fs = require("fs");
const sql_config = JSON.parse(
    fs.readFileSync("controllers/config/sql_config.json", "utf-8")
);
const SQL = sql_config.sql;

// ------------------------------------------------------------------------------------------------------------------ //
// --- SUBS FUNCTIONS -------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Executes a database query to link classes using the provided query.
 *
 * @param {string} query - The SQL query to execute.
 * @param {function} callback - The callback function to handle the query result.
 * @return {void} The callback function is called with the query result or an error.
 */
const linkClasses = (query, callback) => {
    pool.getConnection((err, db) => {
        if (err) callback(err, null);
        db.query(
            {
                sql: query,
                timeout: 10000,
            },
            (err, rows, fields) => {
                db.release();
                if (err) callback(err, null);
                callback(null, rows);
            }
        );
    });
};

/**
 * Inserts data into the 'ter' table based on the contents of a file.
 *
 * @param {string} c - the number of classes to be inserted
 * @param {string} l - the total number of classes
 * @param {string} file - the name of the file containing the data
 * @return {void} This function does not return anything.
 */
const inertClassesFileSQL = (c, l, file) => {
    const path = "controllers/misc/classes/" + file;
    const content = fs.readFileSync(path, "utf-8");

    let lines = content.split("\n");
    let query = `INSERT INTO ter (enseignant, classe) VALUES`;
    let subClasseQuery = `(SELECT id_class FROM Ref_Classe WHERE classe = '${
        file.split(".")[0]
    }')`;

    lines.forEach((line) => {
        let teacherName = line.split(" ")[0];
        let subquery = `(select id_ens from Enseignant where nom = "${teacherName}")`;
        query += ` (${subquery},${subClasseQuery}),`;
    });

    query = query.slice(0, -1);
    linkClasses(query, (err, result) => {
        if (c == l) {
            console.log(
                "\u001b[" +
                    32 +
                    "m" +
                    `[CLASSES : "AUTO LAUNCHED PROCESS" - (${new Date().toLocaleString()}) - OK / CLASSES INSERTED]` +
                    "\u001b[0m"
            );
        }
    });
};

const filterBYClass = (teachers, classes, callback) => {
    
};

/**
 * Executes a database query and returns the result.
 *
 * @param {string} query - The SQL query to execute.
 * @param {function} callback - The callback function to handle the query result.
 * @return {void}
 */

// ------------------------------------------------------------------------------------------------------------------ //
// --- MAINS FUNCTIONS ------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Retrieves a list of files in the "controllers/misc/classes" directory and performs a specified callback for each file.
 *
 * @param {function} callback - The callback function to be executed for each file.
 * @return {void}
 */
const insertClassesFiles = (callback) => {
    let path = "controllers/misc/classes";
    let files = fs.readdirSync(path);
    let c = 1;
    files.forEach((file) => {
        inertClassesFileSQL(c, files.length, file);
        c++;
    });
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = { linkClasses };
