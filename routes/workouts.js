
//set up routing with Express
const express = require('express')
const router = express.Router()

//Reference workout Model
const workout = require('../models/workout')

//Use Passport to Check our Auth
const passport = require('passport')

//Auth check function to be called for each route
function isLoggedIn(req, res, next) {
    //If user has logged ini, call next which will just continue execution
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}


//Get workouts index view
router.get('/', isLoggedIn, (req, res, next) => {
    //use the workout model to fetch a list of workouts and pass these to the view display
    //if err, the err parameter will be filled
    //if not, the workout parameter will be filled with the query result
    workout.find((err, workouts) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.render('workouts/index',
                {
                    workouts: workouts,
                    user: req.user
                })
        }
    })
})
//GET workouts add view
router.get('/add', isLoggedIn, (req, res, next) => {
    res.render('workouts/add', {
        user: req.user
    })
})

//POST workouts/add for submission
router.post('/add', isLoggedIn, (req, res, next) => {
    workout.create({
        name: req.body.name,
        priority: req.body.priority
    }, (err, workout) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/workouts')
        }
    })
})


//GET workouts/delete/ - colon in the path represents a URL parameter
router.get('/delete/:_id', isLoggedIn, (req, res, next) => {
    //store the selected id in a local variable
    var _id = req.params._id;
    //Use Mongoose to delete the selected document from the DB
    workout.remove({ _id: _id }, (err) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/workouts')
        }
    })
})

///////   GET    //////////
//GET ///////workouts/edit/....  populate edit for  with my existing workout values
router.get('/edit/:_id', isLoggedIn, (req, res, next) => {
    //store the _id parameter in a local var
    var _id = req.params._id
    //use the selected _id to lookup the matching document
    workout.findById(_id, (err, workout) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.render('workouts/edit',
                {
                    workout: workout,
                    user: req.user
                })
        }
    })
})



/////// POST ///////workouts/edit/:_id -> updated selected workout document
router.post('/edit/:_id', isLoggedIn, (req, res, next) => {
    var _id = req.params._id
    //parse checkbox to a boolean
    let complete = false
    if (req.body.complete === "on") {
        complete = true
    }

    console.log('Complete value: ' + req.body.complete)
    //instantiate a workout object with the new values from the form submission
    var workout = new workout({
        _id: _id,
        name: req.body.name,
        priority: req.body.priority,
        complete: complete
    })
    //update document with selected id, passing new workout object to replace old values
    workout.update({ _id: _id }, workout, (err) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/workouts')
        }
    })
})

////

//Make Controller Public
module.exports = router