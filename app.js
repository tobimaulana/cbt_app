var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tagihanRouter = require('./routes/tagihan');
var soalRouter = require('./routes/soal');
var jawabanRouter = require('./routes/jawaban');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  secret: 'SI_19A1_nfhge7swfsyegd44gcf'
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tagihan', tagihanRouter);
app.use('/soal', soalRouter);
app.use('/jawaban', jawabanRouter);


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
