var express = require('express');
var router = express.Router();
const {authJWT}= require('../middleware');
const axios =require('axios');


const authCheck = function(req, res, next){
    if(!req.user){
        console.log('not auth')
        res.redirect("http://localhost:3000/login");

    }else{
        next()
    }
}

router.get('/' ,[authJWT.verifyToken],function(req, res){
    console.log('in movi');
    var page = req.query.page
    console.log('pagepage',page)
    let sort;
    console.log(req.query)
    if (!req.query.items){
      sort="download_count"
     
    }else{
        sort = req.query.items
       
      console.log(sort,'sort_by');
    }
    console.log(sort,'sort_by in');

    
    axios({
        "method":"GET",
        "url":`https://yts.mx/api/v2/list_movies.json?page=${page}&limit=20`,
        "mode":"no-cors",
        "headers":{
        "content-type":"application/json"
        },"params":{
          "sort_by":sort,
          }
        })
        .then((response)=>{

          res.json({ data: JSON.stringify(response.data) });
        })
        .catch((error)=>{
          console.log(error)
        })
        console.log('in movie')
})



module.exports = router;