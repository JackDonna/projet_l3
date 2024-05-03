const asyncHandler = require("express-async-handler");
const { getMyDiffusions, getDiffusionsProvisor } = require(__dirname +
    "/cruds/crud_diffusion.js");
const Session = require(__dirname + "/utils/session.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //

/**
 * This function is an async handler for getting my diffusion.
 * It calls the getMyDiffusions function with the request and response objects.
 * If an error occurs, it logs the error and sends a status of 500.
 * If successful, it sends the result.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.getMyDiffusionsREQUEST = asyncHandler((req, res) => {
    Session.pIsValidated(req, res, () => {
        getMyDiffusions(req, res, (err, result) => {
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
 * Delete a teacher in the diffusion list on a absence.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.deleteTeacherOnDiffusion = asyncHandler((req, res) => {
    deleteOnDiffusion(req.body.teacherID, req.body.absenceID, (err, result) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            console.info(result);
        }
    });
});

exports.diffusionsProvisorREQUEST = asyncHandler((req, res) => {
    console.log("proviseur");
    getDiffusionsProvisor(req, res, (err, result) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.send(result);
        }
    });
});
