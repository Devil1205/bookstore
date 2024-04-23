const mongoose = require('mongoose');
const Book = new mongoose.Schema({
    isbn: {
        type: Number,
        required: [true, "ISBN number is required"],
        minLen: [14, "ISBN number must be 14 digit"],
        maxLen: [14, "ISBN number must be 14 digit"],
        unique: true
    },
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    author: {
        type: String,
        required: [true, "Author is required"],
    },
    publisher: {
        type: String,
        required: [true, "Publisher is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    addedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    year:{
        type: Number,
        required: [true, "Publishing year is required"],
        minLen: [4, "Year must be 4 digit"],
        maxLen: [4, "Year must be 4 digit"],
    },
    addedAt: Date,
});

module.exports = mongoose.model('Book', Book);
