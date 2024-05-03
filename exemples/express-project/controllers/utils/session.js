const logger = require(__dirname + "/logger.js");

function createSession(
    req,
    name,
    firstname,
    mail,
    idEtablishement,
    idTeacher,
    isValidated,
    isAdministrator,
    callback
) {
    req.session.regenerate((err) => {
        if (err) callback(err, null);
        req.session.nom = name;
        req.session.prenom = firstname;
        req.session.mail = mail;
        req.session.idEtablishement = idEtablishement;
        req.session.valide = isValidated;
        req.session.id_ens = idTeacher;
        req.session.admin = isAdministrator;
        req.session.signedIn = true;
        req.session.save((err) => {
            callback(err, true);
        });
    });
}

function isAuthenticated(req, res, next) {
    if (!req.session.signedIn) {
        res.redirect("/sign_in");
    } else {
        next();
    }
}

function isValidated(req, res, next) {
    isAuthenticated(req, res, () => {
        if (!req.session.valide) {
            res.redirect("/valide_account");
        } else {
            next();
        }
    });
}

function isAdministrator(req, res, next) {
    isValidated(req, res, () => {
        if (!req.session.admin) {
            res.redirect("/forbidden");
        } else {
            next();
        }
    });
}

function pIsAuthenticated(req, res, next) {
    if (!req.session.signedIn) {
        logger.log(
            logger.YELLOW,
            "SECURITY",
            req.ip,
            "NOT AUTHENTICATED / REFUSED ACCESS"
        );
        res.redirect("/sign_in");
    } else {
        logger.log(
            logger.GREEN,
            "SECURITY",
            req.session.nom,
            "AUTHENTICATED / ACCESS GRANTED"
        );
        next();
    }
}

function pIsValidated(req, res, next) {
    isAuthenticated(req, res, () => {
        if (!req.session.valide) {
            logger.log(
                logger.YELLOW,
                "SECURITY",
                req.session.nom,
                "NOT VALIDATED / REFUSED ACCESS"
            );
            res.redirect("/valide_account");
        } else {
            logger.log(
                logger.GREEN,
                "SECURITY",
                req.session.nom,
                "VALIDATED / ACCESS GRANTED"
            );
            next();
        }
    });
}

function pIsAdministrator(req, res, next) {
    isValidated(req, res, () => {
        if (!req.session.admin) {
            logger.log(
                logger.YELLOW,
                "SECURITY",
                req.session.nom,
                "NOT EVEN VALIDATED / ACCESS REFUSED"
            );
            res.redirect("/forbidden");
        } else {
            logger.log(
                logger.GREEN,
                "SECURITY",
                req.session.nom,
                "ADMINISTRATOR / ACCESS GRANTED"
            );
            next();
        }
    });
}

module.exports = {
    isAuthenticated,
    isValidated,
    isAdministrator,
    pIsAuthenticated,
    pIsValidated,
    pIsAdministrator,
    createSession,
};
