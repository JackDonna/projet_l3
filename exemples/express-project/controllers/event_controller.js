const asyncHandler = require("express-async-handler");
const
    {
    get_timetable,
    get_events_by_teacher_id,
    insert_timetable,
    } = require(__dirname + "/cruds/crud_event.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //
/**
 * @function insert_timetable for post request, insert a timetable in the SQL database
 * @body link to get the timetable from an external server (pronote, EDT, school software ...)
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.insert_timetable = asyncHandler((req, res) =>
{
    insert_edt(req, res, (err, result) =>
    {
        if(err) {console.error(err); res.sendStatus(500)};
        res.sendStatus(200);
    })
})

/**
 * @function get_timetable for get request, query collection of event to the SQL database
 * @params teacher id to query the correct events
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.get_timetable = asyncHandler((req, res) =>
{
    get_timetable(req, res, (err, result) =>
    {
        if(err) {console.error(err); res.sendStatus(500)};
        res.send(result);
    })
})

// --------------------------------------- NOT IMPLEMENTED YET ----------------------------------------- //
exports.event_list = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
});
exports.event_detail = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
})
exports.event_create_get = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
});
exports.event_delete_get = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
});
exports.event_update_get = asyncHandler(async (req, res, next) => {
    res.sendStatus(501);
});