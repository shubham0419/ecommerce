const { string } = require('joi');
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    username:{
        type:String,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    }
},{timestamps:true});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;