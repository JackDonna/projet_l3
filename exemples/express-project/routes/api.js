var express = require('express');
var router = express.Router();
const axios = require("axios");
const utils = require('./utils/ics_utils');
const ical = require('ical');


/* GET users listing. */
router.post("/download", (req, res) => {
  let url = req.body.url;
  axios.get(url, {responseType: 'blob'}).then( (response) => {
    res.send({"code": 1, "data" : utils.parseICSURL(response.data, ical)}) ;
  })
})
module.exports = router;
