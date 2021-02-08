const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        require: true
    },
    user: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("PSWDReset", tokenSchema);