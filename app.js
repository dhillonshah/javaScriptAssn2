var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//add new Lit Fitness
var workoutsRouter = require('./routes/workouts');

//Ref for Auth
const passport = require('passport')
const session = require('express-session')
//const localStategy = require('passport-local').Strategy

var app = express();

//datatbase connection - try to connect an log a pass/fail result!
const mongoose = require('mongoose')
const globals = require('./config/globals')
mongoose.connect(globals.db,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(
        (res) => {
            console.log('Connection to MongoDb')

        }).catch(() => {
            console.log('Connection Error')
        })


//Passport Initialization
//1. Configure app to manage sessions
app.use(session({
    secret: 'workoutManagerSecret',
    resave: true,
    saveUninitialized: false
}))

//2.  Set up Passport
app.use(passport.initialize())
app.use(passport.session())

//3.  Link Passport to our User Model
const User = require('./models/user')
passport.use(User.createStrategy())

//4. Set up Passport to Read /Write user data to the session object
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/workouts', workoutsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
