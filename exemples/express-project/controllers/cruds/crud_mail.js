const nodemailer = require('nodemailer');
const fs = require("fs");
const conf_file = JSON.parse(fs.readFileSync("controllers/config/mail_config.json", "utf-8"));
const conf = conf_file.transporter_config;
let mdp = 'azertgbn_';
let mail = 'rdp@dptinfo-usmb.fr';
const transporter = nodemailer.createTransport({
    // host: 'mail.partage.univ-smb.fr',
    host: 'ssl0.ovh.net',
    // port: 587,
    port: 465,
    secure: true,
    auth: {
        user: mail,
        pass: mdp
    }
});
require('dotenv').config();

// -------------------------------------------------- SUBS FUNCTIONS ------------------------------------------------ //
/**
 * function send an e-mail with nodemailer built-in library
 * @param to {string} recipient for the e-mail
 * @param subject {string} subject of the e-mail
 * @param message {string} message of the e-mail
 * @param callback {function} callback function (err, result)
 */
function send_mail(to, subject, message, callback)
{
    console.log(conf);
    transporter.sendMail(
        {
            from: conf.auth.pass,
            to: to,
            subject: subject,
            text: message
        }, (err, result) =>
    {
        if(err) callback(err, null);
        callback(null, true);
    })
}

// ---------------------------------------------------- MAINS FUNCTIONS --------------------------------------------- //
/**
 * functions send an e-mail to verify a teacher with the correct code (needed to validate himself)
 * @param req router parameters
 * @param res router parameters
 * @param callback {function} callback function (err, result)
 */
function send_mail_for_verification(req, res, callback)
{
    send_mail(
        req.params.mail,
        "Inscription Application RDP",
        "Bonjour votre compte sur l'application RDP à bien été enregistré. \n" +
        "Vous pouvez dès maintenant l'activer avec le code de verification suivant : " + req.params.number,
        (err, result) =>
        {
            if(err) callback(err, null);
            callback(null, true);
        }
    )
}

// --------------------------------------------------- EXPORTS ------------------------------------------------------ //
module.exports = {send_mail_for_verification}

