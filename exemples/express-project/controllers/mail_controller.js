const asyncHandler = require("express-async-handler");
const {RequestResponse} = require("./utils/object_engine");
const
    {
        send_mail_for_verification
    } = require(__dirname + "/cruds/crud_mail.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //

/**
 * @function send_verification_mail get request to send a mail with smtp server to the given mail address
 * @params mail and number of the recipient
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
exports.send_verification_mail = asyncHandler((req, res) =>
{
    send_mail_for_verification(req, res, (err, result) =>
    {
        let response = new RequestResponse
        (
            "mailAPI",
            "GET",
            result,
            "boolean",
            "Send mail with query params",
            err
        );

        if(err) console.error(err);
        res.send(response);
    })
})