const Review = require("../models/review");

const isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author._id.equals(req.session.user.id)) {
        req.flash("error", "You are not author of this review to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = isReviewAuthor;