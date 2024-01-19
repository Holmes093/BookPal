// Code is mostly sampled from my Cloud Computing Coursework

const express = require('express');
const router = express.Router();

const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validations/validation')

const bcryptjs = require('bcryptjs')

// POST Endpoints //

// Register endpoint
router.post('/register', async (req, res) => {
    // Validation of user input.
    const { error } = registerValidation(req.body);
    if (error) {
        // Return error message if validation fails.
        return res.status(400).send({ message: error['details'][0]['message'] })
    }

    // Validation to check user is unique.
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) {
        // Return error message if user already exists. 
        return res.status(400).send({ message: 'User already exists' })
    }

    // Create a hashed representation of users password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // Create new user with hashed password.
    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        location: req.body.location,
        age: req.body.age
    })

    try {
        // Save the new user in the database
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (error) {
        // Return any errors from user registration process.
        res.status(400).send({ message: error })
    }
})

// Login endpoint
router.post('/login', async (req, res) => {
    // Validation of user input.
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send({ message: error['details'][0]['message'] })
    }

    // Validate if user exists
    const userExists = await User.findOne({ email: req.body.email })
    if (!userExists) {
        // Return error message if user does not exist. 
        return res.status(400).send({ message: 'User does not exist' })
    }

    // Validation of user password
    const passwordValidation = await bcryptjs.compare(req.body.password, userExists.password)
    if (!passwordValidation) {
        // Return error message if password does not pass validation. 
        return res.status(400).send({ message: 'Incorrect password provided' })
    }

    // Set user ID in session
    req.session.userId = userExists._id

    // Send a success message
    res.json({ success: true });

})

module.exports = router