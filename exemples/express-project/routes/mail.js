const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const neo4j = require("neo4j-driver");
let mdp = 'azertgbn_';
let mail = 'rdp@dptinfo-usmb.fr';
require('dotenv').config();
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
function mailSend(mailOptions){
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("ERREUR Mail : ",error);
        } else {
            console.log(' => Email sent: ' + info.response);
        }
    });
}
function send(to,objet,msg) {
    let mailOptions = {
        from: mail,
        to: to,
        subject: objet,
        text: msg
    };
    mailSend(mailOptions)

}

/* GET users listing. */
router.get("/test", (req, res) => {
    res.send("test du mail");
})

router.get("/send_verif_mail/:mail/:number", (req,res)=>{
    send(req.params.mail, "Inscription RDP","Bonjour, un compte sur l'application RDP à été enregistrer avec votre mail : " + req.params+mail + "" +
        "<br>Si vous n'êtes pas l'auteur de cet enregistrement veuillez ne pas prendre en compte ce mail, sinon vous pouvez valider votre compte grâce au code suivant : <strong>" + req.params.number + "</strong>");
})


router.get("/verif",(req,res)=>{

    /*######################################################
    Import & Constantes
    ######################################################*/
    var mail = 'rdp@dptinfo-usmb.fr';
    var mdp = 'azertgbn_';

    var transporter = nodemailer.createTransport({
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

    /*######################################################
    Fonction
    ######################################################*/
    function mailSend(mailOptions){
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log("ERREUR Mail : ",error);
            } else {
                console.log(' => Email sent: ' + info.response);
            }
        });
    }
    function send(to,objet,msg) {
        var mailOptions = {
            from: mail,
            to: to,
            subject: objet,
            text: msg
        };
        mailSend(mailOptions)

    }


    send(req,'test','test')



})



module.exports = router;




