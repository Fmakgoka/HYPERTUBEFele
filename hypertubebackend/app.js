var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');
var bodyParser = require('body-parser');
const passportSetup = require('./model/passport-setup');
var jsonwt = require("jsonwebtoken");
const jwt = require('express-jwt');
const keys = require('./model/key');
const passport = require('passport');


var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var authRouter = require('./routes/auth');
var homepageRouter = require('./routes/homepage');
var forgotpasswordRouter = require('./routes/forgotpassword');
var activateaccRouter = require('./routes/activateAccount')
var profileRouter = require('./routes/profile')
var resetpasswordRouter = require('./routes/resetpassword')
var searchRouter = require('./routes/search')
var detailRouter = require('./routes/movieDetails')
var torrentRouter = require('./routes/torrent')
var commentRouter = require('./routes/comment')
// var tokenRouter = require('./routes/token')
const key = require('./model/key');
const con = require('./model/connect');
const { use } = require('passport');


var app = express();

//app.set('trust proxy', 1) // trust first proxy

// app.use(cookieSession({
//   maxAge:24*60*60*1000,
//   keys: [key.session.cookieKey]
// }))


//initialize passport
app.use(passport.initialize())
// app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors({credentials: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// var corsOption = {
//   origin: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   exposedHeaders: ['x-auth-token']
// };
// app.use(cors(corsOption));

app.use('/register', registerRouter)
app.use('/login', loginRouter);
app.use('/auth', authRouter);
app.use('/homepage',homepageRouter);
app.use('/forgotpassword', forgotpasswordRouter);
app.use('/activateAccount', activateaccRouter);
app.use('/profile', profileRouter);
app.use('/resetpassword', resetpasswordRouter);
app.use('/search', searchRouter);
app.use('/movieDetails', detailRouter);
app.use('/torrent', torrentRouter);
app.use('/comment', commentRouter);
// app.use('/token', tokenRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page'
  console.log(err.message)
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
