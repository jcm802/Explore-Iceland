// ===== This file was only used for early testing DB storing of index images ==== //
const mongoose = require("mongoose");

let indexSchema = new mongoose.Schema({
	name: String,
	image: String
});
module.exports = mongoose.model("IndexImages", indexSchema);