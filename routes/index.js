var express = require('express');
var router = express.Router();
var Card = require('../models/card');  
var Product = require('../models/product');
var User = require('../models/user');
var Product = require('../models/product');
var Review = require('../models/review');
var Order = require('../models/order');

const { session } = require('passport');
const { check, validationResult } = require('express-validator/check');

var ObjectId = require('mongodb').ObjectID;


/* GET home page. */
router.get('/', function(req, res, next) {

  Product.find( function(err,docs){
    res.render('shop/index', { title: 'E comerce' , products : docs  });
  });
});

/* GET Thank you for buying */
router.get('/thankyou', function(req, res, next) {
  if(!req.session.card){
    return res.redirect('/');
  }
  var card = new Card(req.session.card);

  
  var order = new Order({
    user : req.user,
    card: card,
    name : res.locals.name
  });

  order.save(function(err,result) {

    req.session.card = null ;

    res.render('shop/thankyou', {products: card.generateArray(), totalPrice : card.totalPrice });
  });

});

/* GET Admin Dashboard */
router.get('/ProdManagement',function(req,res,next){

  Product.find( function(err,docs){
    res.render('admin/ProdManagement',{products : docs});
  });

});



router.get('/ProdManagement/:id',function(req,res,next){

 // Product.remove({ _id: req.params.id});

  Product.deleteOne( { "_id" : ObjectId(req.params.id) } , function(err,done){
    if(err){
      console.log(err);
    }
  });

  res.redirect('/ProdManagement')
});



router.get('/addProduct', isLoggedIn , function(req,res,next){

  res.render('admin/addProduct');
});

router.post('/addProduct', function(req,res,next){
 
  var Products  = [
    new Product({
    imagePath : req.param('image'),
    title: req.param('title'),
    description : req.param('desc'),
    price: req.param('price')
})];
Products[0].save();

  res.redirect('/');
});


/* GET Shopping card */

router.get('/shoppingCard/:id', isLoggedIn ,function(req,res,next){
    var productId = req.params.id ; 
    var card = new Card(req.session.card ?  req.session.card : {} );  
    Product.findById(productId, function(err,product){
      if(err){
        return res.redirect('/');
      }
      card.add(product,productId);
      req.session.card = card; 
      res.redirect('/');
    })
});

router.get('/shopping-card', function(req,res,next){
  if(!req.session.card){
    return res.render('shop/shopping-card', {products: null});
  }
  var card = new Card(req.session.card);
  res.render('shop/shopping-card', {products: card.generateArray(), totalPrice : card.totalPrice });
});


router.get('/shopping-card/reduce/:id',function(req,res,next){
  var id =req.path.split('/')[3];
  var  card = new Card(req.session.card).generateArray();
  var priceOfOne = 0;

  for(i=0;i<card.length;i++){
    if(card[i].item._id == id){   
      if(card[i].qty > 0)   {
        priceOfOne = card[i].price / card[i].qty;
       

        card[i].qty = card[i].qty-1;
        card[i].price =   priceOfOne * card[i].qty;
        console.log(card[i].price );

        req.session.card.totalQty = req.session.card.totalQty - 1 ;

        
        req.session.card.totalPrice = req.session.card.totalPrice - priceOfOne;

          if(req.session.card.totalQty == 0 ){
            req.session.card = undefined;
          }
          if( card[i].qty == 0){
            card[i] = undefined;
          }
      }
   
    }
  }
  
  var card = card.filter(function (el) {
    return el != null;
  });

  res.redirect('/shopping-card'); 

});

router.get('/shopping-card/remove/:id',function(req,res,next){
  var id =req.path.split('/')[3];
  var  card = new Card(req.session.card).generateArray();


  for(i=0;i<card.length;i++){
    if(card[i].item._id == id){   
      if(card[i].qty > 0)   {
        console.log(card[i].price);

        req.session.card.totalPrice = req.session.card.totalPrice - card[i].price;
        console.log(req.session.card.totalPrice);
        req.session.card.totalQty = req.session.card.totalQty - card[i].qty ;


        card[i].qty = 0;
          if(req.session.card.totalQty == 0 ){
            req.session.card = undefined;
          }
          if( card[i].qty == 0){
            card[i] = undefined;
          }
      }
   
    }
  }
  
  var card = card.filter(function (el) {
    return el != null;
  });
  
  res.redirect('/shopping-card');
});


// *GET Id page (Review) *//
router.get('/reviews/:id' , function(req,res,next){
  var productId = req.params.id ; 
  Product.findById(productId, function(err,product){
    if(err){
      return res.redirect('/');
    }
    
  Review.find( {ProductId: req.params.id}, function(err,docs){
    res.render('shop/SeereviewPage' , {title: product.title , productImage : product.imagePath , description : product.description , price : product.price , productId : productId ,reviews : docs});
  });
  })

});


router.get('/:id' , function(req,res,next){
  var productId = req.params.id ; 
  Product.findById(productId, function(err,product){
    if(err){
      return res.redirect('/');
    }
    
  Review.find( {ProductId: req.params.id}, function(err,docs){
    res.render('shop/reviewPage' , {title: product.title , productImage : product.imagePath , description : product.description , price : product.price , productId : productId ,reviews : docs});
  });
  })

});

router.post('/addReview',function(req,res,next){
 
  var MyReview = req.param('ReviewDesc');
  var ProdID = req.param('prodId');

User.findById( req.session.passport.user, function(err,user){

  var Reviews  = [
    new Review({
      userId           :  user.name,
      ProductId        :  ProdID ,
      reviewDescription:  MyReview
  })];
  Reviews[0].save();
});

res.redirect('/ProdID');
});

module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } 
  res.redirect('/');
}

function arrayToList(array) {
    let list = null;
    for (let i = array.length - 1; i >= 0; i--) {
        list = { value: array[i], rest: list };
    }
    return list;
};