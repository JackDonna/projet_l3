const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_api'
  })
  
  connection.connect(function (err) {
      if (err) throw err;
      console.log('connection')
  })

const asyncHandler = require("express-async-handler");

// liste tout les évenements
exports.event_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author list");
});

// information pour un evénement
exports.event_detail = asyncHandler(async (req, res, next) => {
    
    res.send(`NOT IMPLEMENTED: event detail: ${req.params.id}`);
});

// Créer un evénement sur POST
exports.event_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: event create POST");
});

// Créer un evénement sur GET
exports.event_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: event create GET");
});

// Supprime un evénement sur POST
exports.event_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: event delete POST");
});

// Supprime un evénement sur GET
exports.event_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: event delete GET");
});

// Modifie un evénement sur POST
exports.event_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: event update POST");
});

// Modifie un evénement sur GET
exports.event_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: event update GET");
});