const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user", userSchema);

module.exports = User;