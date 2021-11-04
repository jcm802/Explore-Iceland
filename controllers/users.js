const User = require('../models/user');

// =================
// USER REGISTRATION PAGE
// =================
module.exports.showRegister = (req, res) => {
    res.render('auth/user/register');
};

// =================
// USER REGISTRATION PROCESS
// =================
module.exports.registerUser = async (req, res, next) => {
    try {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    // log the user in after sign up
    req.login(registeredUser, err => {
        if(err) return next(err);
        // if there is no error
        req.flash('success', 'User account created successfully');
        res.redirect('/thingstodo');
    })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

// ============
// USER LOGIN PAGE
// ============
module.exports.showLogin = (req, res) => {
    res.render('auth/user/login');
};

// ============
// LOGIN LOGIC - Causing 404
// ============
module.exports.loginLogic = (req, res) => {
    try {
    //if user makes it this far they have successfully logged in
    req.flash('success', 'You are now logged in');
    // after login send them back to where they were
    const redirectUrl = req.session.returnTo || '/home';
    // delete from session
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    } catch(e) {
        console.log(e);
    }
};

// ======
// LOGOUT
// ======
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/home');
};


