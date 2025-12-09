const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const WrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const isReviewAuthor = require("../middleware/isReview.js");
const reviewController = require("../controllers/Review.js");


const reviewValidate = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};


// reviews - create route
router.post(
    "/",
    reviewValidate,
    isLoggedIn,
    WrapAsync(reviewController.createReview)
);

//review delete route
router.delete(
    "/:reviewId",
    isLoggedIn, isReviewAuthor,
    WrapAsync(reviewController.deleteReview)
);

module.exports = router;