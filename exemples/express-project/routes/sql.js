var express = require('express');
var router = express.Router();

// controllers
const user_controller = require("../controllers/userController");
const event_controller = require("../controllers/eventController");
const etab_controller = require("../controllers/etabController");





// --- USERS CONTROLLERS --- //

// request for list of user
router.get("/users", user_controller.user_list);

// request for creating user
router.get("/user/:mail/:numen/:nom/:prenom/create", user_controller.user_create);

// request for delete user
router.get("/user/:id/delete", user_controller.user_delete);

// request for update user
router.get("/user/:id/:nom/:prenom/update", user_controller.user_update);

// request for one user
router.get("/user/:id/detail", user_controller.user_detail);

router.get("/user/sign_in/:mail/:password", user_controller.user_sign_in);

router.post("/user/sign_up", user_controller.user_create);

router.get("/user/verifie_user/:number", user_controller.user_verify);



// --- EVENT CONTROLLERS --- //

// GET request for list of event
router.get("/events", event_controller.event_list);

// GET request for creating event
router.get("/event/create", event_controller.event_create_get);

// GET request for delete event
router.get("/event/:id/delete", event_controller.event_delete_get);

// GET request for update event
router.get("/event/:id/update", event_controller.event_update_get);

// GET request for one event
router.get("/event/:id", event_controller.event_detail);




// --- ETABLISSEMENT CONTROLLERS --- //

// request for list of etablissement
router.get("/etabs", etab_controller.etab_list);

// request for one etablissement
router.get("/etab/:id/detail", etab_controller.etab_detail);


module.exports = router;