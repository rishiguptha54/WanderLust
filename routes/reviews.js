const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");
const {listingSchema, reviewSchema } = require("../schema");
const Listing = require("../models/listings");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware");

//post review route
router.post("/",isLoggedIn,validateReview,async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview.author);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully added a review!");
    res.redirect(`/listings/${listing._id}`);
});

//delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review!");
    res.redirect(`/listings/${id}`);
});

module.exports = router;