var express = require('express');
var router = express.Router();
var sql = require('../query/query')
var bcrypt = require('bcrypt')
const key = require('../model/key')
var jwt = require("jsonwebtoken");
const cors = require('cors');

router.options('/', cors());
router.get('/', function (req, res) {
    res.redirect("http://localhost:3000/login");
});

router.post('/', async function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password) {
        res.sendStatus(401).send({ message: "nothing is provided", accessToken: null });
        res.end()
    } else {
        usernameExists = false
        var check = await sql.checkUserNameExists(username);
        if (check.length == 0) {
            res.status(401).send({
                message: "user does not exist",
                accessToken: null
            });
            res.end()
        } else {
            await bcrypt.compare(password, check[0].password, function (err, result) {
                if (result == true) {
                    var verify;
                    check.forEach(element => {
                        if (username == element.username) {
                            usernameExists = true;
                            verify = check[0].verify;
                        }
                    })
                    if (usernameExists == true && verify == 'yes') {
                        let token = jwt.sign({ 
                            id: check[0].user_id 
                        }, key.jwt.secret, { expiresIn: '1h' });
                        res.cookie('jwt', token)
                        console.log('login session ')
                        
                        res.status(200).send({
                            id: check[0].user_id,
                            firstname:check[0].firstname,
                            lastname:check[0].lastname,
                            username: check[0].username,
                            email: check[0].email,
                            Image: check[0].image,
                            accessToken: token
                        });
                        res.end()

                    }else{
                        return res.status(401).send({
                            accessToken: null,
                            message:"activate your account "
                        })
                    }
                } else{
                    return res.status(401).send({
                        accessToken: null,
                        message:"Invalid password/ username"
                    })
                }
            })

        }

    }
}
)




module.exports = router;