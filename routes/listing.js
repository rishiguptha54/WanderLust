const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const { listingSchema, reviewSchema } = require("../schema");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");

const upload = multer({ storage });

router
    .route("/")
    .get(listingController.index)
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        listingController.createListing
    );

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .get(listingController.showListing)
    .put(isLoggedIn,isOwner,validateListing,listingController.updateListing)
    .delete(isLoggedIn,isOwner,listingController.destroyListing);


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEditForm);

module.exports = router;

