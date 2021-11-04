const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Thingstodo = require('../models/thingstodo');
// User can leave reviews and add activities to their planner, plans are stored on their account
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Storing plans for each user in an array using existing thingstodo information
    // When a user clicks 'add to plan', the object id of each thing to do is pushed into their user array
    thingstodo: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Thingstodo'
        }
    ]
});
// adds (unique only) username and password
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);