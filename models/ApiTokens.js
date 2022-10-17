const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        require: true
    },
    regToken: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    finishedUp: {
        type: Date
    },
    user: {
        type: String
    },
    setup: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("ApiToken", tokenSchema);