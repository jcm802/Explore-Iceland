// ======
// CONFIG
// ======
const express 		= require("express"),
	  app 			= express(), 
	  bodyParser 	= require("body-parser"),
	  mongoose 		= require("mongoose"),
	  passport		= require("passport"),
	  LocalStrategy = require("passport-local"),
	  IndexImage    = require("./models/indexImages"),
	  seedDB		= require("./seeds");

// Seed the DB
//seedDB();	  

var url = process.env.DATABASEURL || "mongodb://localhost/iceland";
// DB will be used for pages other than INDEX - LOCAL
mongoose.connect(url, { 	useNewUrlParser: true,
useUnifiedTopology: true})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// To retrieve values from a form if added
app.use(bodyParser.urlencoded({extended:true}));

// Use view engine
app.set("view engine", "ejs");

// Use stylesheets from public folder
app.use(express.static(__dirname + "/public"))

// ======
// INDEX
// ======
app.get("/", (req, res) => {
	// Checking we can retrieve an image and display something from it
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

// ======
// SERVER ROUTE
// ======
app.listen(process.env.PORT || 3000, () => {
	console.log("Server on port 3000 started...");
});

