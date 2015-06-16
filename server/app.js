var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var apiOrder = require('./routes/api/order');

var app = express();

// Serving client
if(app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, '../client/.tmp')));
  app.use(express.static(path.join(__dirname, '../client/app')));
  app.use(express.static(path.join(__dirname, '../client')));
} else if(app.get('env') === 'production') {
  app.use(express.static(path.join(__dirname, '/dist')));
}

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/order', apiOrder);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('Error: ' + err.message + ', ' + err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send('Error: ' + err.message);
});


module.exports = app;
