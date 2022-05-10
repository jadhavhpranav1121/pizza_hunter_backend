const mongoose = require("mongoose");
const customerScheme = new mongoose.Schema({
    // _id: Number,
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    Pass: {
        type: String,
        required: true,
        trim: true
    },
    phone_number: {
        type: Number,
        minLength: 10,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true,
    }
})
const customer = new mongoose.model('customers', customerScheme);
module.exports = customer;