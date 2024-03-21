const asyncHandler = require("express-async-handler");
const { RequestResponse } = require("./utils/object_engine");
const express = require("express");
const { getMyDiffusionExport } = require(__dirname +
  "/cruds/crud_diffusion.js");

// ----------------------------------- EXPORTS FUNCTIONS CRUDS RESULT -------------------------------- //

/**
 * Retrieves diffusion data for the current user.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {void}
 */
exports.getMyDiffusion = asyncHandler((req, res) => {
  getMyDiffusionExport(req, res, (err, result) => {
    let response = new RequestResponse(
      "diffusionAPI",
      "GET",
      result,
      "boolean",
      "Get my diffusion",
      err
    );

    if (err) console.error(err);
    res.send(response);
  });
});
