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

// DB will be used for pages other than INDEX
mongoose.connect("mongodb://localhost/iceland", { 	useNewUrlParser: true,
useUnifiedTopology: true})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// To retrieve values from a form if added
app.use(bodyParser.urlencoded({extended:true}));

// Use view engine
app.set("view engine", "ejs");

// Use stylesheet
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
// HOME
// ======
app.get("/home", (req, res) => {
	res.render("2_home");
});

// ======
// SERVER
// ======
app.listen(process.env.PORT || 3000, () => {
	console.log("Server on port 3000 started...");
});

