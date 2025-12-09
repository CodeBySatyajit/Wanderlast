const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing");
const WrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const isOwner = require("../middleware/isOwner.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });



const listingValidate = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

router.route("/")
    .get(WrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        listingValidate,
        WrapAsync(listingController.createListing)
    );


// form to create a new listing - MUST BE BEFORE /:id ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(WrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), listingValidate,
        WrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner,
        WrapAsync(listingController.deleteListing)
    );

//update route
router.get(
    "/:id/edit", isLoggedIn,
    WrapAsync(listingController.RenderEditForm)
);

module.exports = router;

