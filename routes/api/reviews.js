const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../../utils/wrapAsync.js");
const Review = require("../../models/review.js");
const Listing = require("../../models/listing.js");
const { apiIsLoggedIn, apiIsReviewAuthor } = require("../../apiMiddleware.js");

// POST /api/listings/:id/reviews
router.post("/", apiIsLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ success: false, error: "Listing not found" });
    }

    const reviewData = req.body.review ? { ...req.body.review } : { ...req.body };
    const newReview = new Review(reviewData);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // Populate author before returning
    await newReview.populate("author", "username");

    res.status(201).json({ success: true, data: newReview });
}));

// DELETE /api/listings/:id/reviews/:reviewId
router.delete("/:reviewId", apiIsLoggedIn, apiIsReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.json({ success: true, message: "Review deleted successfully" });
}));

module.exports = router;
