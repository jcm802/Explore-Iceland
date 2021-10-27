// This statement takes variables from the .env file and makes them available to the rest of the app
// Use process.env.<variable> to retrieve them
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
// ======
// CONFIG
// seeded activities
const { Router } = require('express');
const activities = require('./mainSeeds/activities');

// ======
// DEPENDENCIES
// ======
const express 			= require('express'), 
	  mongoose 			= require('mongoose'),
	  // Optional layout syntax for partials
	  ejsMate           = require('ejs-mate'),
	  // Advanced data validation (joi is required in schema)
	  { thingstodoSchema,
		 reviewSchema } = require('./joiSchemas'),
	  // Overriding browser constraints on request types
	  methodOverride	= require('method-override'),
	  // Modular error handling
	  catchAsync 		= require('./utils/catchAsync'),
	  ExpressError      = require('./utils/ExpressError'),
	  // Authentication
	  session			= require('express-session'),
	  passport			= require('passport'),
	  LocalStrategy 	= require('passport-local'),
	  // Flash
	  flash				= require('connect-flash'),
	  // Used to join folder paths to file for public access
	  path				= require('path'),
	  // Models
	  IndexImage    	= require('./models/indexImages'),
	  Plan          	= require('./models/plan'),
	  User              = require('./models/user'),
	  seedDB			= require('./seeds'),
	  // Routes
	  thingstodoroutes  = require('./routes/thingstodo'),
	  reviewRoutes      = require('./routes/reviews'),
	  userRoutes		= require('./routes/users'),
	  // Prevents mongo injection
	  mongoSanitize = require('express-mongo-sanitize'),

	  // Mitigates cross site scripting, click-jacking etc.
	  helmet		= require('helmet'),
	  // App connection to express
	  app 				= express();

const url = process.env.DATABASEURL || "mongodb://localhost:27017/iceland";

// Connecting mongoose
mongoose.connect(url, { 	
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// Ejs-mate setup - telling express to use this engine instead of the default
app.engine('ejs', ejsMate)
// Use view engine for ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Prevents mongo injection - removes dollar signs or periods from query, option to replace instead of remove
app.use(mongoSanitize());

// Parse the body from a post request otherwise it will not appear
app.use(express.urlencoded({extended: true}));

// Method-override - This allows setting up of PUT/PATCH route successfully
app.use(methodOverride('_method'));

// Use stylesheets from public folder - static assets are files that the server doesn't change
app.use(express.static(__dirname + "/public"));

// Sessions setup
const sessionConfig = {
	name: 'session',
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		// Session cannot be accessed with JS
		httpOnly: true,

		// Cookies only used over https
		//secure: true,

		// Date is in ms, expire in 1 week
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
// Must be before passport session
app.use(session(sessionConfig));

// Flash
app.use(flash());

// Helmet - Custom content security policy
const scriptSrcUrls = [
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
	"https://code.jquery.com/",
    "https://maxcdn.bootstrapcdn.com/",
	"https://stackpath.bootstrapcdn.com",
	"https://maps.googleapis.com/",
];
const styleSrcUrls = [
    "https://maxcdn.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
	"https://cdn.bootstrap.com/",
	"https://toert.github.io/",
	"https://cdnjs.cloudfare.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
	"https://cdnjs.cloudfare.com/",
];
const fontSrcUrls = ["https://fonts.gstatic.com"];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dp0ylwjhc/",
                "https://images.unsplash.com/",
				"https://maps.gstatic.com/",
				"https://googleapis.com",
				"https://ggpht.com",
				"https://cdnjs.cloudfare.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
			frameSrc: "https://www.google.com/",
        },
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Important! - Must go before all routes
app.use((req, res, next) => {
	// Setting to locals giving access to these params from all templates
	// Giving access to current user for all templates
	res.locals.loggedInUser = req.user;

	// For flash Middleware
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// Using the routes files
app.use('/thingstodo', thingstodoroutes);
app.use('/thingstodo/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// ======
// INDEX
// ======
// TEST
// ======
app.get("/", (req, res) => {
	// Check retrieving an image and display something from it
	IndexImage.findOne((err, foundImage) => {
		if(err){
			console.log("ERROR!");
			console.log(err);
		} else {
			res.render("1_index", {indexImage: foundImage});
		}
	})
});

// ======
// HOME ROUTE
// ======
app.get("/home", (req, res) => {
	res.render("2_home");
});

// ======
// EXPLORE ROUTE
// ======
app.get("/explore", (req, res) => {
	res.render("3_explore");
});

// ==========
// ==========
// PLANNER - IN PROGRESS ------------------------------------------------
// ==========
// Todo:
// - Move routes to own file and condense in a controller
// - Link saved attractions with user
// - Add delete functionality
// ==========

// TESTING - ADDING A PLAN TO PLAN COLLECTION
// =======
app.get("/makeplan", catchAsync(async (req, res) => {
	// creating a new plan object
	const plan = new Plan({date: '16/10/1990', time: '2:30pm'})
	// save it so it is permanent
	await plan.save()
	// send the object in the response to the template
	res.send(plan);
}));

// MY PLANNER ROUTE *GET*
// =====
// Showing our DB content
app.get("/myplanner", catchAsync(async (req, res) => {
	// retrieve from db
	const plans = await Plan.find({})
	// pass to template
	res.render('5_my_planner', { plans });
}));

// ============
// MY PLANNER DELETE ROUTE *DELETE* - IN PROGRESS
// ============

// END OF PLANNER ROUTES
// ------------------------------------------------------

// =============
// FOR ALL PATHS
// =============
// To catch a page that doesn't exist (lexical order important!)
app.all('*', (req, res, next) => {
	// moves to the error handler
	next(new ExpressError('Page Not Found', 404))
});

// =============
// ERROR HANDLER
// =============
app.use((err, req, res, next) => {
	// destructuring error params
	const { statusCode = 500 } = err;
	if(!err.message) err.message = 'Something went wrong!';
	// passing status, rendering template, passing error to template
	res.status(statusCode).render('errorPage', { err });
	// === TEST ===
	// res.send('Something went wrong!')
});

// ======
// SERVER ROUTE
// ======
app.listen(process.env.PORT || 3000, () => {
	console.log("Server on port 3000 started...");
});

