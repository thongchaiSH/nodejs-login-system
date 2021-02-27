var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',enSureAuthenticate, function(req, res, next) {
  res.render('index', { title: 'Thongchai' });
});

function enSureAuthenticate(req,res,next){
  console.log("isAuthenticated",req.isAuthenticated());
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/users/login');
  }
}

module.exports = router;
