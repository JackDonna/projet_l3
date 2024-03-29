const asyncHandler = require("express-async-handler");
const { RequestResponse } = require("./utils/object_engine");
const { insertTimetableURL, insertTimetablesFiles, getYourTimetable, getEventByID } = require(__dirname +
    "/cruds/crud_event.js");
const Session = require(__dirname + "/utils/session.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //

/**
 * Handles the insertTeacherTmetableREQUEST endpoint.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A Promise that resolves when the function completes.
 */
exports.insertTeacherTimetableREQUEST = asyncHandler(async (req, res) => {
    Session.pIsValidated(req, res, () => {
        insertTimetableURL(req, res, (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    });
});

/**
 * Handles the get_timetable endpoint.
 *
 * GET request to get the timetable of a teacher,
 * sends a Json with the result of the database query.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A Promise that resolves when the function completes.
 */
exports.getYourTimetableREQUEST = asyncHandler(async (req, res) => {
    Session.pIsValidated(req, res, () => {
        getYourTimetable(req, res, (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.send(result);
            }
        });
    });
});

/**
 * Inserts timetable files into a database.
 *
 * @async
 * @function insertTimetablesFilesREQUEST
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
exports.insertTimetablesFilesREQUEST = asyncHandler((req, res) => {
    Session.pIsAdministrator(req, res, () => {
        insertTimetablesFiles(req, res, (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    });
});

// --------------------------------------- NOT IMPLEMENTED YET ----------------------------------------- //
exports.event_list = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
});
exports.event_detail = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
});
exports.event_create_get = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
});
exports.event_delete_get = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
});
exports.event_update_get = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
});
