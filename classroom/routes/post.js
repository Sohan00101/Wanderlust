const express = require("express");
const router = express.Router();

//Index- Post
router.get("/", (req,res) => {
    res.send("GET post info here");
});

router.get("/:id", (req,res) => {
    res.send("GET for show posts");
});

router.post("/", (req,res) => {
    res.send("POST for posts");
});

router.delete("/:id", (req,res) => {
    res.send("DELETE for post id")
});

module.exports = router;