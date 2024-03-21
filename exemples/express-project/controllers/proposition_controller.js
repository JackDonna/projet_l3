const asyncHandler = require("express-async-handler");
const { RequestResponse } = require("./utils/object_engine");
const express = require("express");
const { proposeOnAbsenceExport, getPropositionOnAbsence, acceptProposition } = require(__dirname +
    "/cruds/crud_proposition.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //

/**
 * Add teacher in the proposition list.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {void}
 */
exports.insertNewProposition = asyncHandler((req, res) => {
    proposeOnAbsenceExport(req, res, (err, result) => {
        let response = new RequestResponse("propositionAPI", "POST", result, "boolean", "Insert proposition", err);
        if (err) console.error(err);
        res.send(response);
    });
});

/**
 * Get all the teacher who propose on an absence.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {void}
 */
exports.TeachersPropositionOnAbsence = asyncHandler((req, res) => {
    getPropositionOnAbsence(req, res, (err, result) => {
        let response = new RequestResponse("propositionAPI", "GET", result, "boolean", "Get teacher on absence", err);
        if (err) console.error(err);
        res.send(response);
    });
});

/**
 * Function to handle accepting a proposition by a teacher.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {void}
 */
exports.acceptPropositionByTeacher = asyncHandler((req, res) => {
    acceptProposition(req, res, (err, result) => {
        let response = new RequestResponse("propositionAPI", "POST", result, "boolean", "Accept proposition", err);
        if (err) console.error(err);
        res.send(response);
    });
});
