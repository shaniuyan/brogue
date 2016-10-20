var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var dbs = require("./db");

var oauth2lib = require('oauth20-provider');
var oauth2 = new oauth2lib({log: {level: 2}});


var mysqldbs = require("./mysqldb");

var configs = require("./configs");
var apiv1 = require('./routes/api.router.v1');
var apicommon = require('./routes/apicommon.router.v1');
//var apiAuthRouter = require('./api/auth/auth.router.v1');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(oauth2.inject());

app.use(function (req, res, next) {
    //req.dbs = dbs;
    req.mysqldbs = mysqldbs;
    req.configs = configs;
    next();
});
//配置权限路由
//var apiAuth = require("./api/auth");
//app.all("/api/*.json", apiAuth.auth.main);

var validatorApp = require("./api/validator")
app.all("/api/v1/*.json", validatorApp.validator.validatorIntercept);

app.get('/token', oauth2.controller.token);


app.use('/api/v1', apiv1);
app.use('/api/common', apicommon);

//app.use('/api/auth', apiAuthRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
