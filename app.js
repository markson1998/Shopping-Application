var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var connectDB = require('./connection'); 
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/user');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');


var app = express();

// connect to database 
const URI = "mongodb+srv://admin:admin@cluster0.pjw4x.mongodb.net/test?authSource=admin&replicaSet=atlas-6mkrsd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
mongoose.connect(URI ,{ useUnifiedTopology: true, useNewUrlParser: true }, () => console.log('connected')) ;
require('./config/passport');

// view engine setup
app.engine('ejs', require('ejs').__express );
app.set('view engine', 'ejs');  
app.use(expressLayouts);
app.set('layout', 'layouts/layout');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

app.use(session(
  {secret : 'mysecret',
   resave : false,
    saveUninitialized:false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: { maxAge : 60 * 60 * 1000 }     // session time
  }
  ));     

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;

if(req.isAuthenticated()){
  User.findById(req.session.passport.user, function(err,user){

    res.locals.name =user.name;
    res.locals.isAdmin =user.isAdmin;
    next();
  });
}else{
  next();
}


});

app.use('/user',userRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
