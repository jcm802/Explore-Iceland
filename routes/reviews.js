const express = require('express'),
    // router keeps params separated so we have to merge params so we can get the review id
    router = express.Router({ mergeParams: true }),
    catchAsync = require('../utils/catchAsync'),
    reviewsController = require('../controllers/reviews'),
	{ validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

// ===========
// REVIEWS ROUTES
// ===========

// CREATE NEW
router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview));

// DELETE
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;