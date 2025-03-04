const Listing = require("../models/listings");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
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
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    try {
        let url = req.file.path;
        let filename=req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;
        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    } catch (e) {
        console.log(e);
        res.render("listings/new.ejs", { listing });
    }
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);

    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename=req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }

    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listings");
};
