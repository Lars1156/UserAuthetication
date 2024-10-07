const express = require('express');
const router = express.Router();

const User = require('../model/user');
const bcrypt = require('bcryptjs');
const user = require('../model/user');

// Register Page
router.get('/register', (req, res) => res.render('register'));
// Loginuser
router.get('/login', (req, res) => res.render('login'));

// Rgister Handdle

router.post('/register', (req , res) =>{
    const{username , email , password , password2} = req.body;
    console.log("**User detaisl" , req.body);
    let errors  = [];
    if(!username || !email || !password || password2){
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }
    if(errors.length > 0)
    {
        res.render('register', {
            errors,
            username,
            email,
            password,
            password2
        })
    }else{
         User.findOne({email : email}) .then(user=>{
            if(user){
                errors.push({ msg: 'Email is already registered' });
                res.render('register', {
                    errors,
                    username,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    username,
                    email,
                    password
                });

                newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered and can log in');
                        res.redirect('/login');
                    })
                    .catch(err => console.log(err));
            }
         })
    }
    
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/login');
}

// Dashboard Route - Fetch all users
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from MongoDB
        res.render('dashboard', {
            user: req.user, // The currently logged-in user
            users // All the users from the database
        });
    } catch (err) {
        console.error(err);
        res.send('Error fetching users');
    }
});

module.exports = router;