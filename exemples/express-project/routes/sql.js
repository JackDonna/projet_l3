let express = require("express");
let router = express.Router();

// ------------------------------------------- IMPORT CONTROLLERS ----------------------------------------- //
const teacher_controller = require("../controllers/teacher_controller");
const event_controller = require("../controllers/event_controller");
const etab_controller = require("../controllers/etablishment_controller");
const absence_controller = require("../controllers/absence_controller");
const proposition_controller = require("../controllers/proposition_controller");

// ------------------------------------------- TEACHER CONTROLLERS ---------------------------------------- //

// router.get("/teacher/:id/:nom/:prenom/update", teacher_controller.user_update);
// router.get("/teacher/detail:id", teacher_controller.user_detail);
router.get("/teacher/sign_in/:mail/:password", teacher_controller.signINREQUEST);
router.get("/teacher/sign_in_as_admin/:mail/:password", teacher_controller.signINAdministratorREQUEST);
router.get("/teacher/getUnavailableTeachers", teacher_controller.getYourTeacherREQUEST);
router.get("/teacher/getTeacher/:name", teacher_controller.searchTeacherREQUEST);
router.post("/teacher/validate", teacher_controller.validateTeacherREQUEST);
router.post("/teacher/sign_up", teacher_controller.signUPREQUEST);
// router.delete("/teacher/delete/:id", teacher_controller.user_delete);

// ------------------------------------------- EVENT CONTROLLERS ----------------------------------------- //
router.get("/event/get_timetable", event_controller.getYourTimetableREQUEST);
router.post("/event/insert_timetable", event_controller.insertTeacherTimetableREQUEST);
router.post("/event/update/:id", event_controller.event_update_get);
router.delete("/event/delete/:id", event_controller.event_delete_get);

// ---------------------------------------- ETABLISSEMENT CONTROLLERS ------------------------------------ //
// router.get("/etabs", etab_controller.etab_list);
// router.get("/etab/:id/detail", etab_controller.etab_detail);

// ------------------------------------------ ABSENCES CONTROLLERS --------------------------------------- //
// router.get("/abs/list/:debut/:fin", absence_controller.list_absence);
router.post("/absence/insert", absence_controller.insertAbsenceREQUEST);
router.get("/absence/get_available_absence", absence_controller.getYourAbsenceREQUEST);
router.post("/absence/filtre", absence_controller.spreadAbsenceREQUEST);

// ------------------------------------------ PROPOSITION CONTROLLERS ------------------------------------ //
// ---- NOT IMPLEMENT YET ------ //
//router.post("/proposition/new_proposition", proposition_controller.insertNewProposition);
//router.get("/proposition/teacher_on_absence/:abs", proposition_controller.TeachersPropositionOnAbsence);
router.post("/proposition/acceptProposition", proposition_controller.acceptPropositionByTeacher);

module.exports = router;
