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
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
  res.render('Admin/adminMain');
})

app.get('/deletePostRequest/:postId', function (req,res) {
  const postId = req.params.postId;
  res.render('Post/deletePostRequest', {postId})
})

app.get('/editPostRequest/:postId', function (req,res) {
  const postId = req.params.postId;
  res.render('Post/editPostRequest', {postId})
})
app.get('/banUser/:ownerId', function (req,res) {
  const ownerId = req.params.postId;
  res.render('Admin/banUser', {ownerId})
})
app.get('/warnUser/:ownerId', function (req,res) {
  const ownerId = req.params.postId;
  res.render('Admin/warnUser', {ownerId})
})



  /*app.get('/', function(req, res) {
    res.render('User/userMain');
  })*/
  /*
  app.get('/', function(req, res) {
    res.render('Auth/login');
  })*/

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

