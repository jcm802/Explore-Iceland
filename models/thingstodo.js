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
    ],
    // Information chosen by the user after adding to plan, this is displayed
    date: String,
    time: String,
    // Displayed date and time is converted into date object format and is sorted on the back end
    dateTime: Date
}, opts); // Adding in JSON and virtual compatibility

// Map Marker Popup Display Information
ThingstodoSchema.virtual('properties.popUpMarkup').get(function () {
    return `<h3 style="color:black;text-shadow:none;">${this.title}</h3>
    <a style="color:black;text-shadow:none;" href="/thingstodo/${this._id}"><strong>More Information</strong></a>`
});
// Optional
// <p style="color:black;text-shadow:none;"><strong>Date:</strong> ${this.date} - <strong>Time:</strong> ${this.time}</p>


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