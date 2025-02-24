const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
    console.log("Database connection successful");
    })
    .catch((err) => {
    console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Hello World");
});

const validateListing = (req, res, next) => {
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
};

//Index Route
app.get("/listings",async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});


//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//show route
app.get("/listings/:id",async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//create route
app.post("/listings",
    async (req, res) => {
    try {
        const listing = new Listing(req.body.listing);
        await listing.save();
        res.redirect(`/listings/${listing._id}`);
    } catch (e) {
        console.log(e);
        res.render("listings/new.ejs", { listing });
    }
});

//edit route
app.get("/listings/:id/edit",async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//update route
app.put("/listings/:id",async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
// app.get("/testListings", async (req, res) => {
//     let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the Beach",
//     price: 1200,
//     location: "Goa",
//     country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successfully tested");
// });

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// })

// app.use((err, req, res, next) => {
//     let {statusCode=500, message="Something went wrong"} = err;
//     res.status(statusCode).render("error.ejs", {message});
//     // res.status(statusCode).send(message);
// });



app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
