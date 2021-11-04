const Thingstodo  = require('../models/thingstodo'),

	// For interacting with cloudinary images
	{ cloudinary } = require('../cloudinary'),

	// MapBox
	mapBoxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"),
	mapBoxToken = process.env.MAPBOX_TOKEN,
	// contains forward geocode
	geocoder = mapBoxGeocoding({ accessToken: mapBoxToken});

// *SHOW ALL* THINGS TO DO ROUTE
module.exports.showAllThingsToDo = async (req, res) => {
	// retrieve from db
	const thingstodos = await Thingstodo.find({})
	res.render("4_things_to_do", { thingstodos });
};

// ======
// This is the post route for new route where the form is submitted to
// This is async because we are interacting with the DB
// Also uses Joi middleware
// ======
// Routes include authorization to stop server side requests
// ======
// *NEW* THINGS TO DO ROUTE - TO BE FIXED MUST BE AUTHORISED (AUTHOR IS NULL)
// This must go lexically before id variable so that fixed params can be found
// ======
module.exports.newThingToDo = async(req, res) => {
	res.render('7_things_to_do_new');
};

// *CREATE THING TO DO ROUTE*
module.exports.createNewThingToDo = async(req, res, next) => {
	const geoData = await geocoder.forwardGeocode({
		query: req.body.thingstodo.location,
		limit: 1
	}).send()
	
	// be very careful that this is the same name that it is under when you first look at the original body sent 
	const thingtodo = new Thingstodo(req.body.thingstodo);
	// Retrieve coordinates
	thingtodo.geometry = geoData.body.features[0].geometry;
	
	// looping over cloudinary files, make an object for each image, and put them in an array in mongo
	thingtodo.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
	
	// author
	thingtodo.author = req.user._id; // associating things to do author with user id (so it knows it's me who made it)
	await thingtodo.save();
	
	// Testing images were recieved
	// console.log(thingtodo);
	
	// flash
	req.flash('success', 'Successfully added thing to do!');
	
	// redirect to things to do page where you should see the new item
	res.redirect("/thingstodo");

	// Testing data is recieved
	// res.send(req.body);
};

// ======
// THINGS TO DO - DETAILS ROUTE (*SHOW*)
// ======
module.exports.showThingToDoDetails = async (req, res) => {
	// getting a reference to the id, including retrieving info of reviews and author associated with a thingtodo
	// also using 'path' populating the author associated with each review
	const thingstodos = await Thingstodo.findById(req.params.id).populate({
		path:'reviews', // populate reviews
		populate: { // populate on each review
			path: 'author' // the review author
		}
	}).populate('author'); // populate the one author on this thingtodo
	// passing through the db data to our template
	// so we can use specific data for that id
	// If no thing to do found (user deletes thing to do and tries to find it again)

	if(!thingstodos){
		req.flash('error', 'Cannot find that thing to do :/');
		return res.redirect('/thingstodo');
	}
	res.render('6_things_to_do_details', { thingstodos });
};

// ======
// THINGS TO DO SHOW EDIT ROUTE *GET*
// ======
// This is the show edit route, it uses the id so it goes underneath the original id route
// it needs the id to repopulate the form which can be edited
module.exports.showEditThingToDo = async(req, res) => {
	const { id } = req.params;
	const thingstodos = await Thingstodo.findById(id);
	if(!thingstodos){
		req.flash('error', 'Cannot find that thing to do :/');
		return res.redirect('/thingstodo');
	};
	res.render('8_things_to_do_edit', { thingstodos });
};

// ==============
// THINGS TO DO EDIT ROUTE *PUT*
// ===========
module.exports.editThingToDo = async (req, res) => {
	const { id } = req.params;
	// Using the grouping by thingstodo (under 'name' in ejs on inputs)
	// Spreading an object into an object
	// Using the same variable name our object is under when we looked at the body
	// console.log(req.body);
	const thingtodo = await Thingstodo.findByIdAndUpdate(id, { ...req.body.thingstodo});
	const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
	// just takes the data from the array not the array itself
	thingtodo.images.push(...imgs);
	await thingtodo.save();
	// if there are images in the deleteImages array
	if(req.body.deleteImages){
		// for each item checked loop over cloudinary images and delete
		for(let filename of req.body.deleteImages){
			await cloudinary.uploader.destroy(filename);
		}
		// remove images from deleteImages array selected in checkboxes
		await thingtodo.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
	}
	// Flash
	req.flash('success', 'Successfully updated thing to do!');
	res.redirect(`/thingstodo/${thingtodo._id}`);
};

// =============
// THINGS TO DO *DELETE* ROUTE - THIS ALSO USES METHOD OVERRIDE
// ============
module.exports.deleteThingToDo = async (req, res) => {
	const { id } = req.params;
	await Thingstodo.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted thing to do');
	res.redirect('/thingstodo');
};
