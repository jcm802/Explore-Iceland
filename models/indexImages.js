const mongoose = require("mongoose");

// Index Image Schema - To allow for changing of images if needed
let indexSchema = new mongoose.Schema({
	name: String,
	image: String
});
module.exports = mongoose.model("IndexImages", indexSchema);