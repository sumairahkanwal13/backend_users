const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishedYear: {
        type: Number,
        required: true
    },
    genre: [{
        type: String,
        required: true
    }],
    language: String,
    country: String,
    rating: Number,
    summary: String,
    coverImageUrl: String,
});

const Books = mongoose.model("Books", BookSchema);
module.exports = Books;