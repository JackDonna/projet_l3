const asyncHandler = require("express-async-handler");
const { RequestResponse } = require("./utils/object_engine");
const { get_teacher_timetable, insert_timetable, insert_timetable_sync, insertTimetableRoot } = require(__dirname +
    "/cruds/crud_event.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //
/**
 * @function insert_timetable for POST request, insert a timetable in the SQL database
 * @body link to get the timetable from an external server (pronote, EDT, school software ...)
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */

exports.insert_teacher_timetable = asyncHandler((req, res) => {
    insert_timetable(req, res, (err, result) => {
        let response = new RequestResponse(
            "eventsAPI",
            "POST",
            result,
            "boolean",
            "put a new timetable link-based or qr-code based",
            err
        );

        if (err) console.error(err);
        res.send(response);
    });
});

/**
 * @function get_timetable for get request, query collection of event to the SQL database
 * @params teacher id to query the correct events
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.get_timetable = asyncHandler((req, res) => {
    get_teacher_timetable(req, res, (err, result) => {
        let response = new RequestResponse(
            "teacherAPI",
            "GET",
            result,
            "<eventsCollection>",
            "get timetable for a teacher by ID",
            err
        );

        if (err) console.error(err);
        res.send(response);
    });
});

/**
 * @function insert_teacher_timetable_sync POST request to insert a timetable into the database, send the result whene database query are finish
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.insert_teacher_timetable_sync = asyncHandler((req, res) => {
    insert_timetable_sync(req, res, (err, result) => {
        let response = new RequestResponse(
            "teacherAPI",
            "POST",
            result,
            "boolean",
            "Insert timetable in the database ( require session connection )",
            err
        );

        if (err) console.error(err);
        res.send(response);
    });
});

exports.insertAsRoot = asyncHandler((req, res) => {
    insertTimetableRoot(req, res, (err, result) => {
        let response = new RequestResponse(
            "teacherAPI",
            "POST",
            result,
            "boolean",
            "Insert timetable in the database ( require session connection )",
            err
        );
        if (err) console.error(err);
        res.send(response);
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
