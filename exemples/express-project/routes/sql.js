var express = require('express');
var router = express.Router();

// controllers
const user_controller = require("../controllers/UserController");
const event_controller = require("../controllers/EventController");
const etab_controller = require("../controllers/EstablishmentController");
const absence_controller = require("../controllers/AbsenceController");





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
router.get("/event/detail/:id", event_controller.event_detail);

// POST request for insert an edt
router.post("/event/insert_edt", event_controller.insert_edt);

router.get("/event/get_edt", event_controller.get_edt);


// --- ETABLISSEMENT CONTROLLERS --- //

// request for list of etablissement
router.get("/etabs", etab_controller.etab_list);

// request for one etablissement
router.get("/etab/:id/detail", etab_controller.etab_detail);

// --- ABSENCES CONTROLLERS --- //

// récupère la liste des absences disponible entre une heure et une autre
router.get("/abs/list/:debut/:fin", absence_controller.list_absence);

// ajoute une absence sur un créneau, une salle et pour une classe
router.get("/abs/ajout/:id_event/:motif", absence_controller.ajout_absence);

module.exports = router;