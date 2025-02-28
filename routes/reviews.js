const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");
const {listingSchema, reviewSchema } = require("../schema");
const Listing = require("../models/listings");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/reviews");
//post review route
router.post("/",isLoggedIn,validateReview,reviewController.createReview);


//delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    reviewController.destroyReview);

module.exports = router;