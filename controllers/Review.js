const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.session.user.id;
    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success", "Added a new review!");
    console.log(newReview);
    res.redirect(`/listings/${listings._id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted the review!");
    res.redirect(`/listings/${id}`);
}
