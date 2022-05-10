const mongoose = require("mongoose");
const itemsScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: String,
        required: true,
        trim: true
    },
    Pass: {
        type: String,
        required: true,
        trim: true
    },
    count: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        trim: true
    }
})
const items = new mongoose.model('items', itemsScheme);
module.exports = items;