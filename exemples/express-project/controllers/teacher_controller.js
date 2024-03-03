const asyncHandler = require("express-async-handler");
const { RequestResponse } = require("./utils/object_engine");
const {
  validate_teacher,
  sign_in,
  sign_up,
  sign_in_admin,
  getTeacherForAdminPanel,
} = require(__dirname + "/cruds/crud_teacher.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //

exports.teachersUnavailable = asyncHandler((req, res) => {
  getTeacherForAdminPanel(req, res, (err, teachers) => {
    let response = new RequestResponse(
      "teacherAPI",
      "GET",
      teachers,
      "boolean",
      "Validate an account",
      err
    );

    if (err) console.error(err);
    res.send(response);
  });
});
/**
 * @function teacher_validation post request to set the validation for a teacher in the SQL database ( need to be sign-in)
 * @body number for validation
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.teacher_validation = asyncHandler((req, res) => {
  validate_teacher(req, res, (err, result) => {
    let response = new RequestResponse(
      "teacherAPI",
      "POST",
      result,
      "boolean",
      "Validate an account",
      err
    );

    if (err) console.error(err);
    res.send(response);
  });
});

/**
 * @function sign_in get request to be signed-in as a teacher
 * @params mail and password
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.sign_in = asyncHandler((req, res) => {
  sign_in(req, res, (err, result) => {
    let response = new RequestResponse(
      "teacherAPI",
      "GET",
      result,
      "boolean",
      "Set session and GET account information",
      err
    );

    if (err) console.error(err);
    res.send(response);
  });
});

/**
 * @function sign_up post request to query the SQL database and create a teacher account after needed verification
 * @body name, firstname, mail and password
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.sign_up = asyncHandler((req, res) => {
  sign_up(req, res, (err, result) => {
    let response = new RequestResponse(
      "teacherAPI",
      "POST",
      result,
      "boolean",
      "Create an account",
      err
    );

    if (err) console.error(err);
    res.send(response);
  });
});

/**
 * @function sign_in_as_admin get request to be signed-in as an admin
 * @params mail and password
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.sign_in_as_admin = asyncHandler((req, res) => {
  sign_in_admin(req, res, (err, result) => {
    let response = new RequestResponse(
      "teacherAPI",
      "GET",
      result,
      "boolean",
      "Set session and GET admin info",
      err
    );

    if (err) console.error(err);
    res.send(response);
  });
});
