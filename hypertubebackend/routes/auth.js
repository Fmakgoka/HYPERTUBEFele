var express = require('express')
const router = express.Router()
const passport = require('passport');
var jwt = require("jsonwebtoken");
const key = require('../model/key')

router.get('/intra', passport.authenticate('42', {
    scope: []
}))

router.get('/github', passport.authenticate('github', {
    scope: ['profile'],
})
)

router.get('/logout', function(req, res){
    req.logOut();
    res.redirect("http://localhost:3000/logout");
})

router.get('/intra/redirect', passport.authenticate('42'),(req, res) =>{
    let token = jwt.sign({
        id: req.user }, 
        key.jwt.secret, { expiresIn: 60});
    res.cookie('jwt', token)
    
    res.redirect('/homepage')
  
})

router.get('/github/redirect', passport.authenticate('github',{ failureRedirect: '/login'}),(req, res) =>{
     console.log('redirected now')
    let token = jwt.sign({
        id: req.user.user_id,
        username: req.user.username
     }, 
        key.jwt.secret, { expiresIn: 60} );
    res.cookie('jwt', token)
    res.redirect('/token')
    res.status(200).send({
        id: req.user.user_id,
        username: req.user.username,
        accessToken: token
    });
    res.end()
})
module.exports = router