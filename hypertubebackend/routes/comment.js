var express = require('express');
var router = express.Router();
const axios = require('axios');
const { authJWT } = require('../middleware')
var sql = require('../query/query');
var video_id;

router.get('/', [authJWT.verifyToken], function (req, res) {
    
})

router.post('/', [authJWT.verifyToken], async function (req, res) {
    try {
        // console.log('in the comment', req.body.video_id);
        var {video_id,comment}  = req.body
        await sql.insertComment(video_id, comment)
        // console.log(comment);
    } catch (error) {
        console.log('error', error);
    }

})



module.exports = router