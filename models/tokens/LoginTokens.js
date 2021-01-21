const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    used: {
        type: Number,
        default: 0
    },
    maxUse: {
        type: Number,
        default: 1,
        require: true
    },
    token: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDev: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Tokens", tokenSchema);