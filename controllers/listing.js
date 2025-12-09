const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { category } = req.query;
    let allListings;
    
    if (category) {
        // Filter by category if provided
        allListings = await Listing.find({ category: category });
    } else {
        // Show all listings
        allListings = await Listing.find({});
    }
    
    res.render("listings/index.ejs", { listings: allListings, selectedCategory: category || null });
}

// render form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// show a single listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: "author" }).populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

// create a new listing
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();
        
    const newlisting = new Listing(req.body.listing);

    if (req.file) {
        newlisting.image = {
            url: req.file.path || req.file.url,
            filename: req.file.originalname || req.file.filename
        };
    }
    newlisting.owner = req.session.user.id;
    newlisting.geometry = response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success", "Created a new listing!");
    res.redirect("/listings");
}

module.exports.RenderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    let orignalImage = listing.image.url.replace("w=800", "w=250");
    res.render("listings/edit.ejs", { listing, orignalImage });
}

// update a listing
module.exports.updateListing = async (req, res) => {

       let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    let { id } = req.params;

    // Get the listing first
    let listing = await Listing.findById(id);
    listing.geometry = response.body.features[0].geometry;


    // Update fields from form
    Object.assign(listing, req.body.listing);

    // If new image uploaded, update it
    if (typeof req.file !== 'undefined') {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // Save the updated listing
    await listing.save();

    req.flash("success", "Updated the listing!")
    res.redirect(`/listings/${id}`);
}

// delete a listing
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedlist = await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success", "Deleted the listing!");
    res.redirect("/listings");
}

