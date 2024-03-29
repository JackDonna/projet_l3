const nodemailer = require("nodemailer");
const fs = require("fs");
const conf_file = JSON.parse(fs.readFileSync("controllers/config/mail_config.json", "utf-8"));
const conf = conf_file.transporter_config;
const mdp = "azertgbn_";
const mail = "rdp@dptinfo-usmb.fr";
const transporter = nodemailer.createTransport({
    host: "ssl0.ovh.net",
    port: 465,
    secure: true,
    auth: {
        user: mail,
        pass: mdp,
    },
});
require("dotenv").config();

// ------------------------------------------------------------------------------------------------------------------ //
// --- SUBS FUNCTIONS -------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Sends an email with the provided information.
 *
 * @param {string} to - The email address to send the email to
 * @param {string} subject - The subject of the email
 * @param {string} message - The message content of the email
 * @param {function} callback - The callback function to handle the result
 * @return {undefined}
 */
const sendMail = (to, subject, message, callback) => {
    transporter.sendMail(
        {
            from: conf.auth.pass,
            to: to,
            subject: subject,
            text: message,
        },
        (err, result) => {
            callback(err, true);
        }
    );
};

/**
 * Sends a verification email to the specified email address with the given validation number.
 *
 * @param {string} mail - The email address to send the verification email to.
 * @param {string} validationNumber - The validation number to include in the email.
 * @param {function} callback - The callback function to execute after sending the email.
 * @return {void} This function does not return anything.
 */
const sendVerificationMailLocal = (mail, validationNumber, callback) => {
    sendMail(
        mail,
        "Inscription Application RDP",
        "Bonjour votre compte sur l'application RDP à bien été enregistré. \n" +
            "Vous pouvez dès maintenant l'activer avec le code de verification suivant : " +
            validationNumber,
        (err, result) => {
            callback(err, true);
        }
    );
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- MAINS FUNCTIONS ------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

/**
 * Sends a verification email using the provided request and response objects, and calls the callback with an error or true as the result.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} callback - the callback function
 * @return {undefined}
 */
const sendVerificationMail = (req, res, callback) => {
    sendMail(
        req.params.mail,
        "Inscription Application RDP",
        "Bonjour votre compte sur l'application RDP à bien été enregistré. \n" +
            "Vous pouvez dès maintenant l'activer avec le code de verification suivant : " +
            req.params.number,
        (err, result) => {
            callback(err, true);
        }
    );
};

// ------------------------------------------------------------------------------------------------------------------ //
// --- EXPORTS --------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

module.exports = { sendVerificationMail, sendVerificationMailLocal };
