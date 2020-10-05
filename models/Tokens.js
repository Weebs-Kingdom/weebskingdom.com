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
    }
});

module.exports = mongoose.model("Tokens", tokenSchema);