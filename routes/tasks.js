
//set up routing with Express
const express = require('express')
const router = express.Router()

//Reference Task Model
const Task = require('../models/task')

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


//Get tasks index view
router.get('/', isLoggedIn, (req, res, next) => {
    //use the task model to fetch a list of tasks and pass these to the view display
    //if err, the err parameter will be filled
    //if not, the task parameter will be filled with the query result
    Task.find((err, tasks) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.render('tasks/index',
                {
                    tasks: tasks,
                    user: req.user
                })
        }
    })
})
//GET tasks add view
router.get('/add', isLoggedIn, (req, res, next) => {
    res.render('tasks/add', {
        user: req.user
    })
})

//POST tasks/add for submission
router.post('/add', isLoggedIn, (req, res, next) => {
    Task.create({
        name: req.body.name,
        priority: req.body.priority
    }, (err, task) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/tasks')
        }
    })
})


//GET tasks/delete/ - colon in the path represents a URL parameter
router.get('/delete/:_id', isLoggedIn, (req, res, next) => {
    //store the selected id in a local variable
    var _id = req.params._id;
    //Use Mongoose to delete the selected document from the DB
    Task.remove({ _id: _id }, (err) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/tasks')
        }
    })
})

///////   GET    //////////
//GET ///////tasks/edit/....  populate edit for  with my existing task values
router.get('/edit/:_id', isLoggedIn, (req, res, next) => {
    //store the _id parameter in a local var
    var _id = req.params._id
    //use the selected _id to lookup the matching document
    Task.findById(_id, (err, task) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.render('tasks/edit',
                {
                    task: task,
                    user: req.user
                })
        }
    })
})



/////// POST ///////tasks/edit/:_id -> updated selected task document
router.post('/edit/:_id', isLoggedIn, (req, res, next) => {
    var _id = req.params._id
    //parse checkbox to a boolean
    let complete = false
    if (req.body.complete === "on") {
        complete = true
    }

    console.log('Complete value: ' + req.body.complete)
    //instantiate a Task object with the new values from the form submission
    var task = new Task({
        _id: _id,
        name: req.body.name,
        priority: req.body.priority,
        complete: complete
    })
    //update document with selected id, passing new task object to replace old values
    Task.update({ _id: _id }, task, (err) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/tasks')
        }
    })
})

////

//Make Controller Public
module.exports = router