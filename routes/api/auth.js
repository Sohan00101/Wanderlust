const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/users.js");
const wrapAsync = require("../../utils/wrapAsync.js");

// GET /api/users/current - Check current authenticated user
router.get("/current", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
            }
        });
    } else {
        res.json({ success: true, user: null });
    }
});

// POST /api/users/signup
router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            res.status(201).json({
                success: true,
                user: {
                    _id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email,
                }
            });
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}));

// POST /api/users/login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ success: false, error: info ? info.message : "Invalid username or password" });
        }
        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.json({
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                }
            });
        });
    })(req, res, next);
});

// POST /api/users/logout
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ success: true, message: "Logged out successfully" });
    });
});

module.exports = router;
