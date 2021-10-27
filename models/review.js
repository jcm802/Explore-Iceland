const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// One user to many reviews
const reviewSchema = new Schema({
    title: String,
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', reviewSchema);
