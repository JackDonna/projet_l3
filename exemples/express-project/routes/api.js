const express = require('express');
const router = express.Router();
const axios = require("axios");
const utils = require('../controllers/utils/ics_utils');
const ical = require('ical');
const mysql = require('mysql');
let asy = require("async");

router.post("/download", async (req, res) => {
  let url = req.body.url;
  get_edt(url, ical, function(err, result)
  {
    let data = [...result];
    insert_all_events(result, req.session.id_ens, function()
    {
      res.send({code: 1, data: data});
    })
  })
});

function test(callback)
{
  for (let i = 0; i < 100000; i++)
  {
    console.log("oui");
  }
  callback();
}
router.get("/test", (req, res) => {
  test(() => {
    res.send("resultat au bout de 5 sec");
  })
})


module.exports = router;