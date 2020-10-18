var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var sql = require('../query/query')
var mail = require('../middleware/emailmassege');
// const Mail = require('nodemailer/lib/mailer');

router.get('/', function (req, res) {
    res.render('forgotpassword');
});

router.post('/', async function (req, res) {
    var email = req.body.email;
    if (!email) {
        res.status(401).send({
            message: "email does not exist",
            accessToken: null
        });
        res.end()
    }
    else {
        emailExist = false;
        try {
            var check = await sql.checkEmailExists(email);
            check.forEach(element => {
                if (email == element.email) {
                    emailExist = true;
                }
            });
            if (emailExist == true) {
                var token = crypto.randomBytes(64).toString('base64');
                await sql.updateToken(token, email);
                token = encodeURIComponent(token)
                await mail.emailForgot(email, token)

            } else {
                res.status(401).send({
                    message: "email not exist",
                    accessToken: null
                });
                res.end()
            }
        } catch (error) {
            console.log("error register ", error.message);


        }
    }
})

module.exports = router;