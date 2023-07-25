const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateReview } = require('../middleware');
const User = require('../models/User');


router.post('/products/:productid/review',validateReview,async(req, res) => {


    try {
        const { productid } = req.params;
        const { rating, comment } = req.body;
        const product = await Product.findById(productid);
        const user = await User.findById(req.user._id);
        const review = new Review({ rating, comment, username:req.user.username,name:user});

        // Average Rating Logic
        const newAverageRating = ((product.avgRating * product.reviews.length) + parseInt(rating)) / (product.reviews.length + 1);
        product.avgRating = parseFloat(newAverageRating.toFixed(1));

        product.reviews.push(review);

        await review.save();
        await product.save();

        req.flash('success', 'Added your review successfully!');
        res.redirect(`/products/${productid}`);
    }

    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
    
});


router.delete("/review/:productId/:id/delete", async (req, res) => {
    try {
        const {productId, id } = req.params;
        await Review.findByIdAndDelete(id);
        
        const product = await Product.findById(productId);
        let newReviews = [];
        for (rev of product.reviews) {
            if (!rev.equals(id)) {
                newReviews.push(rev)
            }
        }
        product.reviews = newReviews;
        await product.save();
        res.redirect(`/products/${productId}`)
    }
    catch(e) {
        res.status(500).render('error', { err: e.message });
    }
    
})

module.exports = router;