const express = require('express'),
	router = express.Router(),
	plannerController = require('../controllers/planner'),
	catchAsync = require("../utils/catchAsync"),
    { isLoggedIn } = require('../middleware');

router.get("/", isLoggedIn, catchAsync(plannerController.showPlanner));

// prevents a 404 error after user tries to add to plan, then logs in and redirects to the planner
router.get("/:thingtodoid", isLoggedIn, catchAsync(plannerController.showPlannerAfterLoginRedirect));

router.post("/:thingtodoid", isLoggedIn, catchAsync(plannerController.addToPlanner));

router.put("/:thingtodoid", isLoggedIn, catchAsync(plannerController.editPlans));

router.delete("/:thingtodoid", isLoggedIn, catchAsync(plannerController.deletePlan));

module.exports = router;