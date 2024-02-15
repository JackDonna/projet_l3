const asyncHandler = require("express-async-handler");
const
    {
        validate_teacher,
        sign_in,
        sign_up
    } = require(__dirname + "/cruds/crud_teacher.js");
const {sign_in_admin} = require("./cruds/crud_teacher");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //
/**
 * @function teacher_validation post request to set the validation for a teacher in the SQL database ( need to be sign-in)
 * @body number for validation
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.teacher_validation = asyncHandler((req, res) =>
{
    validate_teacher(req, res, (err, result) =>
    {
        if(err) {console.error(err); res.sendStatus(500)};
        res.sendStatus(200);
    })
})

/**
 * @function sign_in get request to be signed-in as a teacher
 * @params mail and password
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.sign_in = asyncHandler((req, res) =>
{
    sign_in(req, res, (err, result) =>
    {
        if(err) {console.error(err); res.sendStatus(500)};
        res.sendStatus(200);
    })
})

/**
 * @function sign_up post request to query the SQL database and create a teacher account after needed verification
 * @body name, firstname, mail and password
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.sign_up = asyncHandler((req, res) =>
{
    sign_up(req, res, (err, result) =>
    {
        if(err) {console.error(err); res.sendStatus(500)};
        res.sendStatus(200);
    })
})

exports.sign_in_as_admin = asyncHandler((res, req) =>
{
    sign_in_admin(req, res, (err, res) =>
    {
        if(err) {console.error(err); res.sendStatus(500)};
        res.sendStatus(200);
    })
})