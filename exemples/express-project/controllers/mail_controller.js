const asyncHandler = require("express-async-handler");
const { RequestResponse } = require("./utils/object_engine");
const { sendVerificationMail } = require(__dirname + "/cruds/crud_mail.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //

/**
 * Sends a verification mail in response to a request
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.sendVerificationMailREQUEST = asyncHandler((req, res) => {
    sendVerificationMail(req, res, (err, result) => {
        let response = new RequestResponse("mailAPI", "GET", result, "boolean", "Send mail with query params", err);

        if (err) console.error(err);
        res.send(response);
    });
});
