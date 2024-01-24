var express = require('express');
var router = express.Router();
var escapeHtml = require('escape-html')

function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else res.redirect("/sign_in")
}

router.get('/sign_up', function (req, res) {
  res.send('<form action="/login" method="post">' +
      'Username: <input name="user"><br>' +
      'Password: <input name="pass" type="password"><br>' +
      '<input type="submit" text="Login"></form>')
})

router.get("/sign_in", function(req, res) {
  res.render("sign_in");
})

router.post('/login', express.urlencoded({ extended: false }), function (req, res) {
  // login logic to validate req.body.user and req.body.pass
  // would be implemented here. for this example any combo works

  // regenerate the session, which is good practice to help
  // guard against forms of session fixation

})

router.get("/calendar", isAuthenticated, (req, res) => {
  console.log(req.session.user)
  res.locals.nom = req.session.nom;
  res.render("calendar");
})

router.get('/logout', function (req, res, next) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
})
module.exports = router;
