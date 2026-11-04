const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.apiIsLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, error: "Authentication required. Please log in first." });
    }
    next();
};

module.exports.apiIsOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ success: false, error: "Listing not found" });
    }
    // If listing has an owner assigned and user is logged in, verify ownership
    if (listing.owner && req.user && !listing.owner.equals(req.user._id)) {
        return res.status(403).json({ success: false, error: "Permission denied: You are not the owner of this listing." });
    }
    next();
};

module.exports.apiIsReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ success: false, error: "Review not found" });
    }
    if (review.author && req.user && !review.author.equals(req.user._id)) {
        return res.status(403).json({ success: false, error: "Permission denied: You are not the author of this review." });
    }
    next();
};
