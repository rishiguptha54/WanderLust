module.exports.isLoggedIn = (req, res, next) => {

    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectUrl=req.originalUrl;
    req.flash("error", "You must be signed in first!");
    res.redirect("/login");
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};