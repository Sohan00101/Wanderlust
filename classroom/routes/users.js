const express = require("express");
const router = express.Router();

//Index- Users
router.get("/", (req,res) => {
    res.send("GET users info here");
});

router.get("/:id", (req,res) => {
    res.send("GET to show user id");
});

router.post("/", (req,res) => {
    res.send("POST for users");
});

router.delete("/:id", (req,res) => {
    res.send("DELETE for user id")
});

module.exports = router;