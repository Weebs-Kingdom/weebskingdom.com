const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    discordId: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("DiscToken", tokenSchema);