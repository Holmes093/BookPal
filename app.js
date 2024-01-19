// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
require('dotenv/config');

// Initialize express app
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR)
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch(err => {
        console.error(err);
    });

// Set static folder
const viewsPath = path.join(__dirname, 'views');

// Authentication check middleware
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

// Routes
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(viewsPath, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(viewsPath, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(viewsPath, 'register.html'));
});

app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            // Handle error
            console.error('Session destruction error:', err);
            return res.status(500).send('Error logging out');
        }
        // Clear the session cookie
        res.clearCookie('connect.sid');
        // Redirect to login page
        res.redirect('/login');
    });
});

// Import User Routes
const userRoute = require('./routes/user');
app.use('/user', userRoute);

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running');
});
