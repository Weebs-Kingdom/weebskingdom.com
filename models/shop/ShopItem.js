const mongoose = require("mongoose");

const shopItem = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    isItem: {type: Boolean, default: false},
    isRole: {type: Boolean, default: false},
    isRoute: {type: Boolean, default: false},
    connectedItemId: String,
    connectedRole: String,
    connectedRoute: String,
    stock: Number,
    hasStocks: {type: Boolean, default: false},
    rarity: String,
    category: String
});

module.exports = mongoose.model("ShopItem", shopItem);