const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const { listingSchema, reviewSchema } = require("../schema");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

//Index Route
router.get("/",async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//New Route
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    console.log(listing.owner.username);
    res.render("listings/show.ejs", { listing });
});

//create route
router.post("/",isLoggedIn,
    async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    } catch (e) {
        console.log(e);
        res.render("listings/new.ejs", { listing });
    }
});

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    req.flash("success", "Successfully edited a listing!");
    res.render("listings/edit.ejs", { listing });
});

//update route
router.put("/:id",isLoggedIn,isOwner,async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${id}`);
});

//delete route
router.delete("/:id",isLoggedIn, isOwner,async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listings");
});

module.exports = router;

