var express = require('express');
var router = express.Router();
const axios = require('axios');
const { authJWT } = require('../middleware')
var sql = require('../query/query')
let id


router.get('/', [authJWT.verifyToken], function (req, res) {
    id = req.query.id;
    console.log(id);
    axios({
        "method": "GET",
        "url": `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`,
        "mode": "no-cors",
        "headers": {
            "content-type": "application/json",
        }
    })
        .then((response) => {
            res.json({ data: JSON.stringify(response.data) });
        })
        .catch((error) => {
            console.log(error)
        })

})

router.get('/views', [authJWT.verifyToken], async function (req, res) {
    try {
        let views = await sql.checkViews(id);
        if (views.length == 0) {
            res.json({ views: 0 })
        } else {

            res.json({ views: views[0].views })

        }

    } catch (error) {

    }
    // console.log('views', views[0].views)
})

router.get('/updateviews', [authJWT.verifyToken], async function (req, res) {
    try {
        let views = await sql.setViews(id);
       console.log("Patch");

    } catch (error) {
    console.log('error', error);
    }
    // console.log('views', views[0].views)
    
})
router.get('/comment', [authJWT.verifyToken], async function (req, res) {
    try {
        console.log('in comment ')
        let comment = await sql.checkComment(id);
        console.log('comment', comment);
        if (comment.length == 0) {
            res.json({ comment: "i enjoy this movie" })
        } else {

            res.json({ comment: comment })

        }

    } catch (error) {

    }
    // console.log('views', views[0].views)
})
module.exports = router;