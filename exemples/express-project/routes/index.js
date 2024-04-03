let express = require("express");
let router = express.Router();
const {
    is_valide_and_authenticated,
    is_admin,
    is_not_admin,
    isOnlyAuthenticated,
    pIsValidated,
    pIsAuthenticated,
    pIsAdministrator,
} = require("../controllers/utils/session");
// ---------------------------------------------------------------

router.get("/", pIsValidated, (req, res, next) => {
    res.render("index");
});
router.get("/sign_in", function (req, res) {
    res.render("sign_in");
});
router.get("/sign_up", function (req, res) {
    res.render("sign_up");
});
router.get("/calendar", pIsValidated, (req, res) => {
    res.locals.nom = req.session.nom;
    res.render("calendar");
});
router.get("/dashboard_admin", pIsAdministrator, (req, res) => {
    res.render("dashboard_admin");
});
router.get("/logout", function (req, res, next) {
    req.session.user = null;
    req.session.save(function (err) {
        if (err) next(err);
        req.session.regenerate(function (err) {
            if (err) next(err);
            res.redirect("/sign_in");
        });
    });
});
router.get("/valide_account", pIsAuthenticated, (req, res) => {
    res.locals.mail = req.session.mail;
    res.render("valide_account");
});
router.get("/forbidden", (req, res) => {
    res.render("forbidden");
});

module.exports = router;
