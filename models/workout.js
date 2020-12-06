// add Mongoose
const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema(
    {

        name:
        {
            type: String,
            required: 'Name is required',
            trim: true
        },
        complete: {
            type: Boolean,
            default: false
        },
        priority: Number
    })

//make this public 
module.exports = mongoose.model('workout', workoutSchema)