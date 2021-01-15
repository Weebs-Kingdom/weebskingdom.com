const mongoose = require("mongoose");

const shopItem = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    isItem: {type: Boolean, default: false},
    isRole: {type: Boolean, default: false},
    connectedItemId: String,
    connectedRole: String,
    stock: Number,
    hasStocks: Boolean,
    rarity: String
});

module.exports = mongoose.model("ShopItem", shopItem);