const express = require("express");
const router = express.Router();
const mail_controller = require("../controllers/mail_controller");

router.get("/send_verification_mail/:mail/:number", mail_controller.sendVerificationMailREQUEST);

module.exports = router;
