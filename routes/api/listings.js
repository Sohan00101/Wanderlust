const express = require("express");
const router = express.Router();
const wrapAsync = require("../../utils/wrapAsync.js");
const Listing = require("../../models/listing.js");
const { apiIsLoggedIn, apiIsOwner } = require("../../apiMiddleware.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;
const multer = require('multer');
const { storage } = require("../../cloudConfig.js");
const upload = multer({ storage });

// GET /api/listings - list with optional filters (?category=...&search=...&minPrice=...&maxPrice=...)
router.get("/", wrapAsync(async (req, res) => {
    const { category, search, minPrice, maxPrice } = req.query;
    let filter = {};

    if (category && category !== "All") {
        filter.$or = [
            { category: category },
            { title: { $regex: category, $options: "i" } },
            { description: { $regex: category, $options: "i" } }
        ];
    }

    if (search) {
        const searchRegex = { $regex: search, $options: "i" };
        const searchCond = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { description: searchRegex }
        ];
        if (filter.$or) {
            filter = { $and: [{ $or: filter.$or }, { $or: searchCond }] };
        } else {
            filter.$or = searchCond;
        }
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter).populate("owner", "username email");
    res.json({ success: true, count: listings.length, data: listings });
}));

// GET /api/listings/:id
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author", select: "username" } })
        .populate("owner", "username email");

    if (!listing) {
        return res.status(404).json({ success: false, error: "Listing not found" });
    }

    res.json({ success: true, data: listing, mapToken });
}));

// POST /api/listings (Create)
router.post("/", apiIsLoggedIn, upload.single('image'), wrapAsync(async (req, res) => {
    let geometry = { type: "Point", coordinates: [77.209, 28.6139] }; // fallback (Delhi)
    const listingData = req.body.listing ? { ...req.body.listing } : { ...req.body };

    if (geocodingClient && listingData.location) {
        try {
            const geoRes = await geocodingClient.forwardGeocode({
                query: listingData.location,
                limit: 1,
            }).send();
            if (geoRes.body.features && geoRes.body.features.length) {
                geometry = geoRes.body.features[0].geometry;
            }
        } catch (e) {
            console.error("Geocoding error:", e.message);
        }
    }

    if (req.file) {
        listingData.image = { url: req.file.path, filename: req.file.filename };
    } else if (typeof listingData.image === "string") {
        listingData.image = { url: listingData.image, filename: "listingimage" };
    }

    listingData.geometry = geometry;
    listingData.owner = req.user._id;

    const newListing = new Listing(listingData);
    await newListing.save();

    res.status(201).json({ success: true, data: newListing });
}));

// PUT /api/listings/:id (Update)
router.put("/:id", apiIsLoggedIn, apiIsOwner, upload.single('image'), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body.listing ? { ...req.body.listing } : { ...req.body };

    if (req.file) {
        updateData.image = { url: req.file.path, filename: req.file.filename };
    } else if (typeof updateData.image === "string" && updateData.image.trim()) {
        updateData.image = { url: updateData.image, filename: "listingimage" };
    }

    // If location changed and geocoding client is available
    if (geocodingClient && updateData.location) {
        try {
            const geoRes = await geocodingClient.forwardGeocode({
                query: updateData.location,
                limit: 1,
            }).send();
            if (geoRes.body.features && geoRes.body.features.length) {
                updateData.geometry = geoRes.body.features[0].geometry;
            }
        } catch (e) {
            console.error("Geocoding error:", e.message);
        }
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, data: updatedListing });
}));

// DELETE /api/listings/:id
router.delete("/:id", apiIsLoggedIn, apiIsOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.json({ success: true, message: "Listing deleted successfully" });
}));

module.exports = router;
