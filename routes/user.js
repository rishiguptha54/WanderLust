const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl}=require("../middleware.js");


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
    try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are successfully signed up!");
        res.redirect("/listings");
    });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

router.get("/login" , (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","welcome back to WanderLust....!");
    res.redirect(res.locals.redirectUrl||"/listings");
})

router.get("/logout", (req, res) => {
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success", "You are successfully logged out!!!!!");
        res.redirect("/listings");
    });
});


module.exports = router;