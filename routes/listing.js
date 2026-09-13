const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

//Index route
router.get("/", wrapAsync(async (req,res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
})
);

//new route
router.get("/new", isLoggedIn ,(req,res) => {
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you searched for not found!");
        return res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listing});
})
);

//create route
router.post("/",isLoggedIn,validateListing, wrapAsync(async(req,res,next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing created!");
        res.redirect("/listing");
    })
);

//edit route
router.get("/:id/edit",isLoggedIn,validateListing, wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you searched for not found!");
        return res.redirect("/listing");
    }
    res.render("listings/edit.ejs",{listing});
})
);

//update route
router.put("/:id",isLoggedIn,validateListing, wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect("/listing")
})
);

//delete route
router.delete("/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
    })
);

module.exports = router;