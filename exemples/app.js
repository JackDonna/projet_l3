/**
 * const variable of libs and module
 */
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const ical = require('ical');
const axios = require('axios');
const utils = require('./utils/ics_utils');

/**
 * setting up express app and environnement variable
 */
app.use(express.json());
app.use(express.static(__dirname));
dotenv.config();

/**
 * API
 */
app.get("/index", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/download", async (req, res) => {
    let url = req.body.url.replace("https", "http");
    if(url.startsWith(process.env.URL_PATERN))
    {
        axios.get(url, {responseType: 'blob'}).then( (response) => {
            res.send(utils.parseICSURL(response.data, ical)) ;
        })
    }
    else
    {
        res.send(0)
    }
})

/**
 * app listening
 */
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
