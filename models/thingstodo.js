// Model for things to do information, includes review model for one user to many reviews
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals:true } };

// For carousel cloudinary images
const ImagesSchema = new Schema({
    url: String,
    filename: String
});

// Creating thumbnails using cloudinary image editor api
ImagesSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const ThingstodoSchema = new Schema({
    title: String,
    // Cover image - requires URL
    image: String,
    // For reference
    // geoJSON - Must be in this format
    // "type": "Point",
    //     "coordinates": [
    //     -18.6054668169534,
    //     64.9975884448459
    //     ]
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    latitude: Number,
    longitude: Number,
    tour: String,
    // For carousel
    images: [ImagesSchema],
    description: String,
    location: String,
    author: { // Ref to id for thingstodo page
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // Storing review object ids in a thing to do
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts); // Adding in JSON and virtual compatibility

// Map Marker Popup Display Information
ThingstodoSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a style="color:black;" href="/thingstodo/${this._id}">More Information: ${this.title}</a>`
});



// Activating middleware with method findByIdAndDelete (exclusively) - accessing document just deleted
ThingstodoSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            // deletes all id fields in the document reviews array just deleted
            _id: {
                $in: doc.reviews
            }
        })
    }
    // checking we can access the doc that was deleted
    // console.log(doc);
});

module.exports = mongoose.model('Thingstodo', ThingstodoSchema);