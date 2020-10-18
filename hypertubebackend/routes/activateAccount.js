var express = require('express');
var router = express.Router();
var sql = require('../query/query')
var token;


/*get*/
router.get('/', async function (req, res) {
    try {
        console.log('we are in active next')
        token = decodeURIComponent(req.query.token);
        if (token) {
            console.log('we are in if')
            let user = await sql.findUserByToken(token);
            user = user[0];
            await sql.activateAccount(user.token);
            res.redirect("http://localhost:3000/login");
            
        }
        //res.end();
    } catch (error) {
        console.log(error)
    }
});


module.exports = router