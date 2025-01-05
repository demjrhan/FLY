var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
    session({
        secret: 'default-random-key',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false},
    })
);

app.get('/', function (req, res) {
    res.render('Auth/welcomePage');
});

app.get('/logInUser/:loggedInUserId', function (req, res) {
    const loggedInUserId = req.params.loggedInUserId;
    req.session.loggedInUserId = loggedInUserId;
    res.render('User/userMain', {loggedInUserId});
});
app.get('/logInAdmin/:loggedInUserId', function (req, res) {
    const loggedInUserId = req.params.loggedInUserId;
    req.session.loggedInUserId = loggedInUserId;
    res.render('Admin/adminMain', {loggedInUserId});
});

app.get('/logOutUser', function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
        } else {
            console.log('Logging out successful');
        }
    });
    res.render('Auth/welcomePage');
});

app.get('/loginUserRequest', function (req, res) {
    res.render('Auth/login');
})
app.get('/registerUserRequest', function (req, res) {
    res.render('Auth/register');
});

app.get('/addPostAdminRequest', function (req, res) {
    res.render('Admin/addPostAdminRequest')
});
app.get('/banUserRequestAdmin/:userId', function (req, res) {
    const userId = req.params.userId;
    const loggedInUserId = req.session.loggedInUserId;
    res.render('Admin/banUser', {userId,loggedInUserId})
});
app.get('/warnUserRequestAdmin/:postId/:userId', function (req, res) {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const loggedInUserId = req.session.loggedInUserId;
    res.render('Admin/warnUser', {postId,userId,loggedInUserId})
});

app.get('/deletePostRequestAdmin/:postId', function (req, res) {
    const postId = req.params.postId;
    res.render('Admin/deletePostRequestAdmin', {postId})
});


app.get('/DeletePostRequest/:postId', function (req, res) {
    const loggedInUserId = req.session.loggedInUserId;
    const postId = req.params.postId;
    res.render('Post/removePost', {postId,loggedInUserId});
});

app.get('/editPostRequestAdmin/:postId', function (req, res) {
    const postId = req.params.postId;
    res.render('Admin/editPostRequestAdmin', {postId});
});
app.get('/EditPostRequest/:postId', function (req, res) {
    const loggedInUserId = req.session.loggedInUserId;
    const postId = req.params.postId;
    res.render('Post/editPost', {postId,loggedInUserId});
});

app.get('/viewUserProfileAdmin/:userId', function (req, res) {
    const userId = req.params.userId;
    res.render('Admin/viewUserProfileAdmin', {userId});
});


app.get('/viewUserProfileGuest/:userId', function (req, res) {
    const userId = req.params.userId;
    res.render('Guest/userProfileGuest', {userId});
});

app.get('/viewUserProfile/:userId', function (req, res) {
    const userId = req.params.userId;
    if (req.session.loggedInUserId) {
        const loggedInUserId = req.session.loggedInUserId;
        if (req.session.loggedInUserId === userId) {
            res.render('User/userProfile', {loggedInUserId });
        } else {
            res.render('User/visitProfile', {userId,loggedInUserId});
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/AddPostRequest', function (req, res) {
    const loggedInUserId = req.session.loggedInUserId;
    res.render('Post/addPost', {loggedInUserId});
})

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

