const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true
    } ,
    image: {
        type: String,
        default: "https://unsplash.com/photos/a-view-of-a-city-from-the-water-xLQM7Tnqdpg",
        set: (v) => v === "" ? "https://unsplash.com/photos/a-view-of-a-city-from-the-water-xLQM7Tnqdpg" : v,
    },
    price: Number,
    location: String,
    country: String, 
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;