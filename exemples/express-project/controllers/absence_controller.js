const asyncHandler = require("express-async-handler");
const { insertAbsence, spreadAbsence } = require(__dirname + "/cruds/crud_absence.js");
const Session = require(__dirname + "/utils/session.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //

/**
 * Inserts an absence request into the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves with the result of the insertion.
 */
exports.insertAbsenceREQUEST = asyncHandler((req, res) => {
    Session.pIsValidated(req, res, () => {
        insertAbsence(req, res, (err, result) => {
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
 * Retrieves the absence requests for the current user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves with the absence requests of the current user.
 */
exports.getYourAbsenceREQUEST = asyncHandler((req, res) => {
    Session.pIsValidated(req, res, () => {
        get_absence(req, res, (err, result) => {
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
 * Filters the absence data based on the provided criteria.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves with the filtered absence data.
 */
exports.spreadAbsenceREQUEST = asyncHandler((req, res) => {
    Session.pIsValidated(req, res, () => {
        spreadAbsence(req, res, (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    });
});
