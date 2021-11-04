const Thingstodo   = require('../models/thingstodo'),
    User           = require('../models/user'),
    // For interacting with cloudinary images
    { cloudinary } = require('../cloudinary'),
    // MapBox
    mapBoxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"),
    mapBoxToken     = process.env.MAPBOX_TOKEN;
    // contains forward geocode
    geocoder        = mapBoxGeocoding({ accessToken: mapBoxToken}),
    { isLoggedIn }  = require('../middleware'),
    moment = require('moment')
    catchAsync      = require("../utils/catchAsync"),
    ExpressError    = require('../utils/ExpressError');

// ====================
// MY PLANNER GET ROUTE
// ====================
module.exports.showPlanner = async (req, res) => {
	// populate user plans
	const plans = await User.findById(req.user.id).populate('thingstodo');
    // sort plans - earliest date and time first
	plans.thingstodo.sort((a, b) => {
			return a.dateTime - b.dateTime;
	});
	// pass to template
	res.render('planner/5_my_planner', { plans });
};

// ================================
// SHOWS MY PLANNER WHEN REDIRECTED AFTER LOGGING IN
// ================================
module.exports.showPlannerAfterLoginRedirect = async(req, res) => {
	const plans = await User.findById(req.user.id).populate('thingstodo');
	res.render('planner/5_my_planner', { plans });
};

// ========
// NEW PLAN - When user clicks on 'Add to plan' the chosen attraction is added to their planner
// ========
module.exports.addToPlanner = async (req, res) => {
	// Find thingtodo 
	const thingtodo = await Thingstodo.findById(req.params.thingtodoid);
	// Find user
	const user = req.user;
	// Check user has not already added attraction to planner by comparing ids
	for(let item of user.thingstodo){
		if(thingtodo._id.equals(item._id)){
			req.flash('error', 'You have already added this attraction to your plan');
			return res.redirect("/thingstodo");
		}
	}
	// Remove time, date and dateTime when adding so previous date and time data isn't present
	thingtodo.date = "";
	thingtodo.time = "";
	thingtodo.dateTime = null;
	console.log(thingtodo);
	// If user does not have this attraction, add to planner 
	user.thingstodo.push(thingtodo);
	// Save
	await thingtodo.save();
	await user.save();
	req.flash('success', 'Attraction added to planner!');
	res.redirect('/myplanner');
};

// ===========
// Edit date and time - User enters a date and time, time and date become fixed (db updated), once this
// happens the time and date is shown and the submit button changes to an edit button.
// If a user clicks edit, date and time are updated. If there is a date and time field set only then is the edit button shown, this
// ensures if a user returns they still see the edit button. Both date and time fields are required. Once a user updates the date and time
// all entries are sorted by date and time.
// ===========
module.exports.editPlans = async (req, res) => {
	// find relevant thing to do
	const newThingtodo = await Thingstodo.findById(req.params.thingtodoid);
	// find user id for use in mongo
	const user = req.user;
	// find relevant thingtodo id
	const thingtodoid = newThingtodo._id;
	// find date and time from form
	let {date, time} = req.body.plan;
	// add ISO formatted date for acceptable dateTime conversion
	newThingtodo.date = date;
	newThingtodo.time = time;
	// convert date and time to dateTime object
	let newDateTime = moment(date + ' ' + time).format();
	let jsDate = moment(newDateTime).toDate();
	// add dateTime object to thingtodo
	newThingtodo.dateTime = jsDate;
	// re-format date for display
	date = moment(date).format('DD/MM/YYYY');
	// add re-formatted date for display
	newThingtodo.date = date;
	// remove original from db
	await User.findByIdAndUpdate(user.id, { $pull: { thingstodo: thingtodoid } });
	// push the updated thingtodo into the user's thingstodo array
	user.thingstodo.push(newThingtodo);
	await newThingtodo.save();
	// save
	await user.save();
	req.flash('success', 'Attraction date and time set!');
	res.redirect("/myplanner");
};

// ===========
// DELETE PLAN
// ===========
module.exports.deletePlan = async (req, res) => {
	// get the thingtodoid
	const { thingtodoid } = req.params;
	// get the userid
	const userid = req.user.id;
	// pull thingtodoid from userid from the User model
	await User.findByIdAndUpdate(userid, { $pull: { thingstodo: thingtodoid } });
	req.flash('success', 'Plan deleted');
	res.redirect('/myplanner');
};