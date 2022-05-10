const mongoose = require("mongoose");
const orderDetailScheme = new mongoose.Schema({
    name: {
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
    },
    Pass: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    total: {
        type: Number,
        required: true,
        trim: true
    }
})
const ordersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    orders: [
        [orderDetailScheme]
    ]
})
const orders = new mongoose.model('orders', ordersSchema);
module.exports = orders;