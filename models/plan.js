// SECTION IN PROGRESS
// Model for user to create information for plans in the 'My plan' section
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals:true } };

// One user to many plans
const PlanSchema = new Schema({
    // information updated when user clicks on 'add plan' from seeded data based on id
    title: String,
    description: String,
    image: String,
    location: String,
    latitude: Number,
    longitude: Number,
    // associating the user with the plan
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
    // information chosen by the user after adding to plan
    date: String,
    time: String,
}, opts);

// For map marker popup display
PlanSchema.virtual('properties.popUpMarkup').get(function () {
    return `<h4 style="color:black;text-shadow:none">${this.title}</h4>
    <p style="color:black;text-shadow:none">Date: ${this.date}</p>
    <p style="color:black;text-shadow:none">Time: ${this.time}</p>
    <a style="color:black;text-shadow:none" href="#">Book: (Link Here)</a>`;
});

module.exports = mongoose.model('Plan', PlanSchema);