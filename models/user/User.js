const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        min: 4
    },
    email: {
        type: String,
        require: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        require: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },

    admin: {
        type: Boolean,
        default: false
    },
    developer: {
        type: Boolean,
        default: false,
    },
    discordId: {
        type: String
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);