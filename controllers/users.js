const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup=async (req, res) => {
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
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to WanderLust....!");
    res.redirect(res.locals.redirectUrl||"/listings");
};

module.exports.logout= (req, res) => {
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success", "You are successfully logged out!!!!!");
        res.redirect("/listings");
    });
};