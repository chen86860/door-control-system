var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var nunjucks = require('nunjucks');
var credentials = require('./lib/credentials');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var routes = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// uncomment after placing your favicon in /public
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//init cookieSecret
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: credentials.cookieSecret,
    cookie: {maxAge: 600000},//设置session十分钟后过期
    resave: false,
    saveUninitialized: true
}));

// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);
app.use('/article', article);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
        statusCode: err.status,
        message: err.message,
        error: err
    })
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            statusCode: err.status,
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
        statusCode: err.status,
        message: err.message,
        error: err
    });
});


module.exports = app;
