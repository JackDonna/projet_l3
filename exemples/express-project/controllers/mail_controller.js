const asyncHandler = require("express-async-handler");
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
        if(err) {console.error(err); res.sendStatus(500)};
        res.sendStatus(200);
    })
})