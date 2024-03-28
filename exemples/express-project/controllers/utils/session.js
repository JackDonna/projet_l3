function createSession(req, name, firstname, mail, idEtablishement, idTeacher, isValidated, isAdministrator, callback) {
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
    return req.session.signedIn;
}

function isOnlyAuthenticated(req, res, next) {
    if (req.session.nom) next();
    else res.redirect("/sign_in");
}

function isValide(req, res, next) {
    return req.session.valide;
}
function isValideAndAuthenticated(req, res, next) {
    if (!isAuthenticated(req, res, next)) {
        res.redirect("/sign_in");
    } else if (!isValide(req, res, next)) {
        console.log(req.session);
        res.redirect("/valide_account");
    } else {
        next();
    }
}

function isAdministrator(req, res, next) {
    if (!req.session.admin) {
        res.redirect("/sign_in");
    } else {
        next();
    }
}

function pIsAuthenticated(req, res, next) {
    if (!req.session.signedIn) {
        console.log(
            "\u001b[" +
                33 +
                "m" +
                `[SECURITY : "${req.ip}" - (${new Date().toLocaleString()}) - NOT CONNECTED / REFUSED ACCESS]` +
                "\u001b[0m"
        );
        res.redirect("/sign_in");
    } else {
        console.log(
            "\u001b[" +
                32 +
                "m" +
                `[SECURITY : "${req.session.nom}" - (${new Date().toLocaleString()}) - CONNECTED / ACCESS GRANTED]` +
                "\u001b[0m"
        );
        next();
    }
}

function pIsValidated(req, res, next) {
    pIsAuthenticated(req, res, () => {
        if (!req.session.valide) {
            console.log(
                "\u001b[" +
                    33 +
                    "m" +
                    `[SECURITY : "${req.ip}" - (${new Date().toLocaleString()}) - NOT VALIDATED / REFUSED ACCESS]` +
                    "\u001b[0m"
            );
            res.redirect("/valide_account");
        } else {
            console.log(
                "\u001b[" +
                    32 +
                    "m" +
                    `[SECURITY : "${req.session.nom}" - (${new Date().toLocaleString()}) - VALIDATED / ACCESS GRANTED]` +
                    "\u001b[0m"
            );
            next();
        }
    });
}

function pIsAdministrator(req, res, next) {
    pIsValidated(req, res, () => {
        if (!req.session.admin) {
            console.log(
                "\u001b[" +
                    31 +
                    "m" +
                    `[URGENT SECURITY : "${req.ip}" - (${new Date().toLocaleString()}) - NOT ADMINISTRATOR / REFUSED ACCESS]` +
                    "\u001b[0m"
            );
            res.redirect("/forbidden");
        } else {
            console.log(
                "\u001b[" +
                    32 +
                    "m" +
                    `[URGENT SECURITY : "${
                        req.session.nom
                    }" - (${new Date().toLocaleString()}) - ADMINISTRATOR / ACCESS GRANTED]` +
                    "\u001b[0m"
            );
            next();
        }
    });
}

module.exports = {
    isAuthenticated,
    isOnlyAuthenticated,
    isValide,
    isValideAndAuthenticated,
    isAdministrator,
    pIsAuthenticated,
    pIsValidated,
    pIsAdministrator,
    createSession,
};
