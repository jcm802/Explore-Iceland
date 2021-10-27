// ==================
// MY PLANNER ROUTES IN PROGRESS
// ==================
const express = require('express'),
	router = express.Router(),
	catchAsync = require("../utils/catchAsync"),
	ExpressError = require("../utils/ExpressError"),
	Thingstodo  = require("../models/thingstodo"),
	Plans = require("../models/plan"),
	{ isLoggedIn } = require('../middleware'),
	{ thingstodoSchema } = require("../joiSchemas");

// Getting one plan via the id, use to add to db
// const id = 1;
// const seedActivity = async() => {
//     await Plan.deleteMany({});
//     const plan = new Plan({
//         title: `${activities[id].title}`,
//         description: `${activities[id].description}`,
//         image: `${activities[id].image}`
//     })
//     await plan.save()
// }

