const passport = require('passport');
const intraStrategy = require('passport-42');
const githubStrategy = require('passport-github')
var sql = require('../query/query')
var jwt = require("jsonwebtoken");
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const key = require('../model/key')


var opts = {}
opts.jwtFromRequest = function(req) {
     // tell passport to read JWT from cookies
    var token = null;
    if (req && req.cookies){
        token = req.cookies['jwt']
    }
    return token
}

opts.secretOrKey = key.jwt.secret

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("JWT BASED AUTH GETTING CALLED") 
    console.log(jwt_payload.data);
    // called everytime a protected URL is being served
    // if (CheckUser(jwt_payload.data)) {
    //     return done(null, jwt_payload.data)
    // } else {
    //     // user account doesnt exists in the DATA
    //     return done(null, false)
    // }
}))


// const key  = require('./key')

passport.serializeUser((user, done) =>{
  ///  console.log('In serializedc' +user.user_id)
    done(null, user);
})

passport.deserializeUser( async function(id, done){
    try {
        var check = await sql.checkUserId(id)
        ///console.log('in deserialized '+check[0])
        done(null, check[0])
    } catch (error) {
        console.log("error register ", error.message);

    }
})

passport.use(
    new intraStrategy({
        clientID: key.intra.clientID,
        clientSecret: key.intra.clientSecret,
       callbackURL:"/auth/intra/redirect"
    }, async function(accessToken, refreshToken, profile, done){
        try {
            var check = await sql.checkUserNameExists(profile. username)
            if (check.length == 0){
               var insert = await sql.insertAuth(profile.username, profile.displayName)
               done(null, insert[0])
            }else{
                //console.log('exists' +check[0]);
                done(null, check[0]);
            }
        } catch (error) {
            console.log("error register ", error.message);
        }
    })
)

passport.use(
    new githubStrategy ({
        clientID: key.github.clientID,
        clientSecret: key.github.clientSecret,
       callbackURL:"/auth/github/redirect"
    }, async function(accessToken, refreshToken, profile, done) {
        try {
            console.log('in github');
            var check = await sql.checkUserNameExists(profile. username)
            if (check.length == 0){
                var insert = await sql.insertAuth(profile.username, profile.displayName)
               
                
                done(null, insert[0])
            }else{
                
                console.log('exists' +check[0]);
                done(null, check[0]);
            }
            
        } catch (error) {
            console.log("error register ", error.message);
        }
    })
)
//  