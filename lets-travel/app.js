require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');




var indexRouter = require('./routes/index');

//For sessions
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//For flash messages
const flash = require('connect-flash');

//For passport.js:
const User = require('./models/user');
const passport = require('passport');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));

//configue passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash messages
app.use(flash());

app.use( (req, res, next) => {
  res.locals.user = req.user;
  res.locals.url = req.path;
  res.locals.flash = req.flash();
  next();
});



//set up mongoose conection
mongoose.connect(process.env.DB, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false 
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise; //global.Promise permite usar todas as promisses nativas possíveis no ES6 sem ter que instalar um módulo npm
mongoose.connection.on('error', (error) => console.error(error.message)); //checar erros de conexão .on é um método node que adiciona um event listener, que nesse caso vai 
//escutar por erros, então se passa 'error' como o primeiro parâmetro e o segundo argumento é uma
//função que vai printar o erro

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
