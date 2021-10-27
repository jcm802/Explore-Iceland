const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
// User can leave reviews and add to planner, plans are stored on their account
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// adds (unique only) username and password
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);