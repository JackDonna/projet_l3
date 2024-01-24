var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get("/test", (req, res) => {

    res.send("test du mail");
})

router.get("/sendmail/:mail", (req,res)=>{

    /*######################################################
    Import & Constantes
    ######################################################*/
    var nodemailer = require('nodemailer');
    const neo4j = require("neo4j-driver");
    require('dotenv').config();
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


    send(req.params.mail, "Inscription RDP",'Vous êtes inscrit votre code d\'inscription est 5f6Xc');



})


router.get("/verif",(req,res)=>{

    /*######################################################
    Import & Constantes
    ######################################################*/
    var nodemailer = require('nodemailer');
    const neo4j = require("neo4j-driver");
    require('dotenv').config();
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




