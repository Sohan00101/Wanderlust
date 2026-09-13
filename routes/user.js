const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req,res) => {
    res.render("user/signup.ejs");
});

router.post("/signup" , wrapAsync(async(req,res) => {
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "welcome to Wanderlust");
        res.redirect("/listing");
    }
    catch(err){
        req.flash("error", error.message);
        res.redirect("/signup");
    }

}));

router.get("/login", (req,res) => {
    res.render("user/signup.ejs");
});

router.post("/login", passport.authenticate("local", { faliureRedirect: '/login', faliureFlash: true }),
async(req,res) => {
    req.flash("success" , "Welcome back to Wanderlust!");
    res.redirect("/listing")
});

router.get("/logout", (req,res,next) => {
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("success", "You have been logged out!");
        res.redirect("/listing");
    });
});

module.exports = router;