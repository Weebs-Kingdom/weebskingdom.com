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
    expires: {
        type: Date,
        require: true
    }
});

module.exports = mongoose.model("EmailAuthTokens", tokenSchema);