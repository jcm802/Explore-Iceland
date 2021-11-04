const { thingstodoSchema, reviewSchema } = require("./joiSchemas"),
    ExpressError = require('./utils/ExpressError'),
    Thingstodo = require('./models/thingstodo'),
    Review     = require('./models/review'),
    catchAsync = require('./utils/catchAsync'),
    { ADMIN_ID } = require("./config");

// Logs the user if successful and tells the user to sign in for tasks requiring authentication
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // stores url they are requesting on session to preserve state
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    // FOR REFERENCE
    // console.log("SUCCESS!!");
    next();
}

// JOI VALIDATION MIDDLEWARE - For validating data sent in the body
module.exports.validateThingstodo = (req, res, next) => {
	// PASSING THROUGH TO SCHEMA
    // console.log(req.body)
    // error destructured from result
	const { error } = thingstodoSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
	// FOR REFERENCE
	// console.log(result);
}

// ADMIN AUTHORISATION MIDDLEWARE
module.exports.isAdmin = catchAsync(async (req, res, next) => {
	// admin id
	const adminId = ADMIN_ID;
	// admin user authorisation
	const { id } = req.params;
	const thingToDoId = await Thingstodo.findById(id);
	// if another user who isn't admin tries to make a thingtodo tell them they don't have permission
	if (req.user._id != adminId){
		req.flash('error', 'You do not have permission to perform this task');
		return res.redirect('/thingstodo');
	} else {
        // otherwise it is admin and allow the task to proceed
        return next();
    }
    // if a thingtodo already exists and the user tries to perform an edit check it against the existing creator id
    if(!thingToDoId.author.equals(req.user._id)){
		req.flash('error', 'You do not have permission to perform this task');
		return res.redirect(`/thingstodo/${id}`);
        // if admin deletes direct them back somewhere that exists (as the thing to do has been deleted)
	} else if(!id) {
        return res.redirect(`/thingstodo`);
    }
});

// Stops review deletion via server requests
module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You cannot delete another user\'\s review');
        return res.redirect(`/thingstodo/${id}`);
    }
    next();
});

// REVIEW VALIDATION MIDDLEWARE
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}