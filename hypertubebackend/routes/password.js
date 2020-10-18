var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var sql = require('../query/query');
const saltRound = 10;

let updating = {};

updating.updatePassword =  async function (req, res,next) {
  var password = req.body.password;
  var confirm = req.body.confirm;
  console.log(token)
  if (!password || !confirm) {
    res.send(401);
    res.end();
  } else {
    if (password === confirm) {
      try {
        let newPassword = await bcrypt.hash(password, saltRound);
        let user = await sql.findUserByToken(token);
        console.log(user)
        user = user[0];
        await sql.updateUserPassword(newPassword, user.user_id);
        res.send(200);
        res.end();
      } catch (error) {
        console.log("error updating password ", error.message);
        res.send(401);
        res.end();
      }
    }
  }
}

module.exports = updating;