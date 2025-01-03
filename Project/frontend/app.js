var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    res.render('Auth/welcomePage.ejs');
});

app.get('/addPostAdminRequest', function (req, res) {
    res.render('Admin/addPostAdminRequest')
});
app.get('/banUserRequestAdmin/:userId', function (req, res) {
    const userId = req.params.userId;
    res.render('Admin/banUserRequestAdmin', {userId})
});
app.get('/warnUserRequestAdmin/:postId', function (req, res) {
    const postId = req.params.postId;
    res.render('Admin/warnUserRequestAdmin', {postId})
});

app.get('/deletePostRequestAdmin/:postId', function (req, res) {
    const postId = req.params.postId;
    res.render('Admin/deletePostRequestAdmin', {postId})
});

app.get('/editPostRequestAdmin/:postId', function (req, res) {
    const postId = req.params.postId;
    res.render('Admin/editPostRequestAdmin', {postId});
});


app.get('/viewUserProfileAdmin/:userId', function (req, res) {
    const userId = req.params.userId;
    res.render('Admin/viewUserProfileAdmin', {userId});
});

app.get('/loginUserRequest', function (req, res) {
    res.render('Auth/login');
})
app.get('/registerUserRequest', function (req, res) {
    res.render('Auth/register');
});

app.get('/viewUserProfileGuest/:userId', function (req, res) {
    const userId = req.params.userId;
    res.render('Guest/userProfileGuest', {userId});
});


app.get('/edit/:id', function (req, res) {
    const postId = req.params.id;
    res.render('edit', {postId});
});


app.use(function (req, res, next) {
    next(createError(404));
});


app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('Error/error');
});

module.exports = app;

