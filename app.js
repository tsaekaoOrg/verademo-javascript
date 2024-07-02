var dotenv = require('dotenv');
dotenv.config();
var createError = require('http-errors');
var express = require('express');

var path = require('path');
var axios = require('axios');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Handlebars = require('hbs')
var session = require('express-session');
var indexRouter = require('./routes/index');
var app = express();

const PORT = process.env.PORT || '3000';


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Creating hbs helper function
Handlebars.registerHelper('eq', function(a, b) {
  if (a==b)
    {
      return true;
    }
  return false;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'resources')));
app.use(session({secret: "secret", saveUninitialized: true, resave: true}));

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

app.listen(PORT, () => {
  console.log(`listening for requests on port ${PORT}`)
})

module.exports = app;
