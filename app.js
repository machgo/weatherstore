var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/weatherstore");

var routes = require('./routes');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use(app.router);
app.get('/', routes.index);
app.get('/api', api.getData);
app.post('/api', api.addData);
app.get('/api/lastday', api.getLastDay);
app.get('/api/current', api.getCurrent);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: err
    });
});


module.exports = app;
