const Review = require('../models/review');
const Thingstodo = require('../models/thingstodo');

// =============
// REVIEW PATH - *CREATE*
// =============
module.exports.createReview = async(req, res) => {
	// Associated things to do with review
	const thingstodo = await Thingstodo.findById(req.params.id);
	const review = new Review(req.body.review);
	
	// Associate author with reviews
	review.author = req.user._id;
	
	// Push to array and save
	thingstodo.reviews.push(review);
	await review.save();
	await thingstodo.save();

	// Flash
	req.flash('success', 'Created new review!');
	res.redirect(`/thingstodo/${thingstodo._id}`);
	// ======== TEST ===========
	// res.send('REVIEW POSTED')
};

// ===========
// REVIEW - *DELETE*
// removing review from inside thingtodo show page
// ===========
module.exports.deleteReview = async (req, res) => {
	// delete review from thingstodo/:id objectId from array
	const { id, reviewId } = req.params;
	// using mongo $pull to retrieve reviewId from reviews
	await Thingstodo.findByIdAndUpdate(id, { $pull: { reviews: reviewId} });
	// delete review
	await Review.findByIdAndDelete(reviewId);
	// flash
	req.flash('success', 'Successfully deleted review');
	// redirect
	res.redirect(`/thingstodo/${id}`);
	//res.send("DELETED");
};