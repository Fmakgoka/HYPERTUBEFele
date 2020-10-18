var express = require('express');
var router = express.Router();
var sql = require('../query/query');
var bcrypt = require('bcrypt');
const saltRound = 10;
var crypto = require('crypto');
const mail = require('../middleware/emailmassege')
var db = require('../query/validate')

router.get('/', function (req, res, next) {
    res.redirect("http://localhost:3000/register");
});

router.post('/', async function (req, res) {
    var username = req.body.username
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var confirm = req.body.confirm;
    if (!username || !firstname || !lastname || !email || !password || !confirm) {
        res.status(401).send({
            message: "user does not exist",
            accessToken: null
        });
        res.end()
    } else {

        emailExists = false;
        usernameExists = false;
        try {
            if (db.usernameV(username) && db.passwordV(password) && db.emailV(email) && db.firstNameV(firstname) && db.lastNameV(lastname)) {
                var check = await sql.checkEmailAndUserNameExists(username, email);
                check.forEach(element => {
                    if (email == element.email) {
                        emailExists = true;
                    }
                    if (username == element.username) {
                        usernameExists = true;
                    }
                });
                if (usernameExists == false && emailExists == false) {
                    if (password == confirm) {
                        let newPassword = await bcrypt.hash(password, saltRound);
                        var token = crypto.randomBytes(64).toString('base64');
                        await sql.insertUserD(username, firstname, lastname, email, newPassword, token);
                        token = encodeURIComponent(token)
                        await mail.emailregister(email, token)
                        res.send({ message: "User was registered successfully check your email for activation" });
                        res.end()

                    }
                } else {
                    res.status(401).send({
                        message: "username/email already exist",
                        accessToken: null
                    });
                    res.end()
                }
            } else {
                if (!db.usernameV(username)) {
                    res.status(401).send({
                        message: "your username need to be 2 - 20 haracters long and contain at least one lower case alphabet",
                        accessToken: null
                    });
                    res.end()

                } else if (!db.emailV(email)) {
                    res.status(401).send({
                        message: "your email needs to be in this format: user@mail.domain",
                        accessToken: null
                    });
                    res.end()
                } else if (!db.passwordV(password)) {
                    res.status(401).send({
                        message: "a password must contain lower and upper case characters, digit(s), and special character(s)",
                        accessToken: null
                    });
                    res.end()
                } else if (!db.lastNameV(lastname)) {
                    res.status(401).send({
                        message: "your firstname need to be 2 - 20 haracters long and contain at least one lower case alphabet",
                        accessToken: null
                    });
                    res.end()

                } else if (!db.firstNameV(firstname)) {
                    res.status(401).send({
                        message: "your lastname need to be 2 - 20 haracters long and contain at least one lower case alphabet",
                        accessToken: null
                    });
                    res.end()
                }
            }

        } catch (error) {
            console.log("error register ", error.message);
            res.status(500).send({ message: err.message });
        }
    }
})


module.exports = router;