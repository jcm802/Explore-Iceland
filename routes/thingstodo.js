const express = require('express'),
	router = express.Router(),
	thingsToDoController = require('../controllers/thingstodo'),
	catchAsync = require("../utils/catchAsync"),
	{ isLoggedIn, isAdmin, validateThingstodo } = require('../middleware'),
	// multer
	multer  = require('multer'),
	{ storage } = require('../cloudinary'),
	upload = multer({ storage });

// ===================
// THINGS TO DO ROUTES
// ===================

// SHOW ALL & CREATE NEW
router.route('/')
	.get(catchAsync(thingsToDoController.showAllThingsToDo))
	.post(isLoggedIn, isAdmin, upload.array('image'), validateThingstodo, catchAsync(thingsToDoController.createNewThingToDo));

// TEST 1
// 	.post(upload2.single('coverImage'), (req, res) => {
// 	console.log(req.file);
// 	console.log(req.files);
// 	res.send("IT WORKED");
// })
	
// TEST 2
// .post(upload.array('image'), (req, res) => {
// 	console.log(req.body, req.files);
// 	res.send("It worked!");
// });

// SHOW NEW - (THIS MUST GO BEFORE THE ID ROUTES)
router.get("/new", isLoggedIn, isAdmin, catchAsync(thingsToDoController.newThingToDo));

// SHOW DETAILS, EDIT AND DELETE
router.route('/:id')
	.get(catchAsync(thingsToDoController.showThingToDoDetails))
	.put(isLoggedIn, isAdmin, upload.array('image'), validateThingstodo, catchAsync(thingsToDoController.editThingToDo))
	.delete(isLoggedIn, isAdmin, catchAsync(thingsToDoController.deleteThingToDo));
	


// SHOW EDIT
router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(thingsToDoController.showEditThingToDo));

module.exports = router;