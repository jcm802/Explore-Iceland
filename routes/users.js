const express = require('express'),
    router = express.Router(),
    catchAsync = require('../utils/catchAsync'),
    passport = require('passport'),
    usersController = require('../controllers/users');

// SHOW REGISTER & REGISTER USER
router.route('/register')
    .get(usersController.showRegister)
    .post(catchAsync(usersController.registerUser));

// SHOW LOGIN AND LOGIN USER - Uses passport middleware (could also use google, twitter, etc)
router.route('/login')
    .get(usersController.showLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersController.loginLogic);

// LOGOUT
router.get('/logout',usersController.logout);

module.exports = router;