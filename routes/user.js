var express = require('express');
var router = express.Router();
var csurf  = require('csurf');
var passport = require('passport');
const order = require('../models/order');
var Card = require('../models/card');  

var csurfProtection = csurf();
router.use(csurfProtection);



router.get('/profile', isLoggedIn ,function (req,res,next) {


  order.find({user: req.user}, function (err, orders) { 
      if(err){
        return res.write('Error');
      }
      var card;
      orders.forEach(function (order) {
        card = new Card(order.card);
        order.items = card.generateArray();

      });

      res.render('user/profile', { orders : orders});
  });


});
 
router.get('/logout', function(req,res,next){
  req.logout();
  res.redirect('/');
})


router.use('/', notLoggedIn , function(req,res,next){
  next();
});

/* GET /user/signup /signin */

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');

  res.render('user/signup' , {csurfToken : req.csrfToken(), messages : messages   });
} );


router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect: '/user/signup' ,
  failureFlash: true
}) );



router.get('/signin', function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signin' , {csurfToken : req.csrfToken(), messages : messages   });
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect : '/',
  failureRedirect: '/user/signin' ,
  failureFlash: true

}));




module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } 
  res.redirect('/');
}

function notLoggedIn(req,res,next){
  if(!req.isAuthenticated()){

    return next();
  } 

  res.redirect('/');
}