const mongoose = require('mongoose');

// Captures all required fields to create a user for Web and Recommendation System
const userSchema = mongoose.Schema({
    email:{ // Email of registrar
        type:String,
        require:true,
        min:3,
        max:256 
    },
    password:{ // Password of registrar
        type:String,
        require:true,
        min:6,
        max:1024
    },
    age: { // Age of user
        type:Number,
        require:true,
        min:13
    },
    location: { // Location of user
        type:String,
        require:true,
        min:2,
        max:1024
    },
    date:{ // Registration timestamp
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('users', userSchema);