const mongoose = require('mongoose');
const Book = new mongoose.Schema({
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
    addedAt: Date,
});

module.exports = mongoose.model('Book', Book);
