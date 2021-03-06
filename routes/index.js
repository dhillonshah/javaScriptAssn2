var express = require('express');
var router = express.Router();

//ref for Auth
const passport = require('passport')
const User = require('../models/user')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Lit Fitness' });
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Lit Fitness',
        user: req.user
    });
});

/*GET/about*/
router.get('/about', (req, res) => {
    res.render('about', {
        message: 'Lit Fitness Web Application gives you the oppertunity to Book a WorkOut.',
        user: req.user
    })
})

//GET /register
router.get('/register', (req, res, next) => {
    res.render('register')
})

//POST /Register
router.post('/register', (req, res, next) => {
    //Use the User model with passport to try a new user
    //passport-local-mongoose will salt and has password
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            //Log the User in and redirect to /workouts
            req.login(user, (err) => {
                res.redirect('/workouts')
            })
        }
    })
})


//GET/login
router.get('/login', (req, res, next) => {
    //Check for Invalid Login message and pass to the view to display
    let messages = req.session.messages || []

    //Clear the Session Message
    req.session.messages = []
    //Pass Local Message variable to the view for display
    res.render('login', {
        messages: messages
    })
})

//POST /Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/workouts',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}))

//GET /Logout
router.get('/logout', (req, res, next) => {
    //Call passport built-in logout method
    req.logout()
    res.redirect('/login')
})


module.exports = router;