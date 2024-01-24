const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const neo4j = require("neo4j-driver");
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

require('dotenv').config();

/* GET users listing. */
router.get("/test", (req, res) => {
    res.send("test du mail");
})

router.get("/send_verif_mail/:mail/:number", (req,res)=>{

    /*######################################################
    Import & Constantes
    ######################################################*/




    /*######################################################
    Fonction
    ######################################################*/

    send(req.params.mail, "Inscription RDP",'Un compte à votre nom à été créer sur RDP, veuillez valider avec le code suivant : ' + req.params.number);



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




