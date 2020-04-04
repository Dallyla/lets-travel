var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');




var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set up mongoose conection
mongoose.connect('mongodb://lets_travel_admin:123456abc@cluster0-shard-00-00-bpdjw.mongodb.net:27017,cluster0-shard-00-01-bpdjw.mongodb.net:27017,cluster0-shard-00-02-bpdjw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',{ 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false 
});
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
