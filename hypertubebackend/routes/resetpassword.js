var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var sql = require('../query/query');
var db = require('../query/validate')
const saltRound = 10;
var token;
var email;

router.get("/", function (req, res) {
  email = req.query.email;
  token = decodeURIComponent(req.query.token);
  if (email && token) {
    res.redirect("http://localhost:3000/password");
  } else {
    res.redirect("http://localhost:3000/forgotpassword");
  }
  res.end();
});

router.post('/', async function (req, res) {
  var password = req.body.password;
  var confirm = req.body.confirm;

  console.log(token)
  if (!password || !confirm) {
    res.send(401);
    res.end();
  } else {

    try {
      if (db.passwordV(password)) {
        if (password === confirm) {
          console.log('here pass')

          let newPassword = await bcrypt.hash(password, saltRound);
          if (!req.reqId) {
            console.log('no req.userId' + token)
            let user = await sql.findUserByToken(token);
            console.log(user)
            user = user[0];
            await sql.updateUserPassword(newPassword, user.user_id);
            res.send(200);
            res.end();
          }
        } else {
          res.status(401).send({
            message: "comfirm password must match password",
            accessToken: null
          });
          res.end()

        }

      } else{
        res.status(401).send({
          message: "a password must contain lower and upper case characters, digit(s), and special character(s)",
          accessToken: null
        });
        res.end()
      }

    } catch (error) {
      console.log("error updating password ", error.message);
      res.send(401);
      res.end();
    }
  }

});

module.exports = router