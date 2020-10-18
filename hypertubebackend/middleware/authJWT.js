const jwt = require("jsonwebtoken");
const db = require("../model/key");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, db.jwt.secret, (err, decoded) => {
    console.log('we have token', token)
    if (err) {
      console.log('error', err)
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    console.log('we are here',req.userId)
    next();
  });
};

const authJwt = {
    verifyToken: verifyToken,
};

module.exports = authJwt;
