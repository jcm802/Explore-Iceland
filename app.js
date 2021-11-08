// Takes variables from the .env file and makes them available to the rest of the app
// Use process.env.<variable> to retrieve them
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// ======
// DEPENDENCIES
// ======
const express 			= require('express'), 
	  mongoose 			= require('mongoose'),
	  // Optional layout syntax for partials
	  ejsMate           = require('ejs-mate'),
	  // Overriding browser constraints on request types
	  methodOverride	= require('method-override'),
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
	  User              = require('./models/user'),
	  // Routes
	  thingstodoroutes  = require('./routes/thingstodo'),
	  reviewRoutes      = require('./routes/reviews'),
	  userRoutes		= require('./routes/users'),
	  plannerRoutes     = require('./routes/planner'),
	  // Prevents mongo injection
	  mongoSanitize = require('express-mongo-sanitize'),

	  // Mitigates cross site scripting, click-jacking etc.
	  helmet		= require('helmet'),
	  // App connection to express
	  app 				= express(),
	  
	  // uses npm connect-mongo, using mongo to store sessions for scalability (default is express sessions)
	  MongoStore		= require("connect-mongo")(session);

			// Mongo Cloud DB (ATLAS)		// Mongo Local DB
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/iceland";
// const dbUrl = process.env.DB_URL;

// Connecting mongoose
mongoose.connect(dbUrl, { 	
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log("Error: " + error.message));

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

// Sessions secret
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoStore({
	url: dbUrl,
	secret,
	// sessions resave only when neccessary (not on each refresh)
	// seconds not milliseconds (set to 24 hours)
	touchAfter: 24 * 60 * 60
});

// Checks session store for errors
store.on("error", function(e){
	console.log("SESSION STORE ERROR", e)
});

// Sessions setup
const sessionConfig = {
	store,
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		// Session cannot be accessed with JS
		// httpOnly: true,

		// Cookies only used over https
		secure: true,

		// Date is in ms, expire in 1 week
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
// Must be before passport session
app.use(session(sessionConfig));

// Flash
app.use(flash());

// This disables the `contentSecurityPolicy` middleware but keeps the rest.
app.use(
	helmet({
	  contentSecurityPolicy: false,
	})
  );

// Helmet - Custom content security policy
// const scriptSrcUrls = [
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
// 	"https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net/",
// 	"https://code.jquery.com/",
//     "https://maxcdn.bootstrapcdn.com/",
// 	"https://stackpath.bootstrapcdn.com/",
// 	"https://maps.googleapis.com/",
// 	"https://ajax.googleapis.com/"
// ];
// const styleSrcUrls = [
//     "https://maxcdn.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
// 	"https://cdn.bootstrap.com/",
// 	"https://toert.github.io/",
// 	"https://cdnjs.cloudfare.com/",
// ];
// const connectSrcUrls = [
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
// 	"https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net/",
// 	"https://code.jquery.com/",
//     "https://maxcdn.bootstrapcdn.com/",
// 	"https://stackpath.bootstrapcdn.com/",
// 	"https://maps.googleapis.com/",
// 	"https://ajax.googleapis.com/"
// ];

// const childSrcUrls = [
// 	"https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
// 	"https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net/",
// 	"https://code.jquery.com/",
//     "https://maxcdn.bootstrapcdn.com/",
// 	"https://stackpath.bootstrapcdn.com",
// 	"https://maps.googleapis.com/",
// 	"https://ajax.googleapis.com/"
// ];
// const fontSrcUrls = ["https://fonts.gstatic.com/"];
// app.use(
//     helmet.contentSecurityPolicy({
// 		sandbox: ['allow-forms'],
//         directives: {
//             defaultSrc: ["'self'"],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...styleSrcUrls],
// 			childSrc: ["'self'", "blob:", ...childSrcUrls],
// 			workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/dp0ylwjhc/",
//                 "https://images.unsplash.com/",
// 				"https://maps.gstatic.com/",
// 				"https://googleapis.com/",
// 				"https://ggpht.com/",
// 				"https://cdnjs.cloudfare.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
// 			frameSrc: "https://www.google.com/",
//         },
//     })
// );

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
app.use('/myplanner', plannerRoutes);

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

// -------------
//  FACTS ROUTE
// -------------
app.get('/facts', (req, res) => {
	res.render('10_facts');
});

// -------------
// ABOUT ROUTE
// -------------
app.get("/about", (req, res) => {
	res.render("9_about");
})

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
app.use((err, req, res) => {
	// destructuring error params
	const { statusCode = 500 } = err;
	if(!err.message) err.message = 'Something went wrong!';
	// passing status, rendering template, passing error to template
	res.status(statusCode).render('errorPage', { err });
	// === TEST ===
	// res.send('Something went wrong!');
});

// ======
// SERVER ROUTE
// ======
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server on port ${port} started...`);
});

