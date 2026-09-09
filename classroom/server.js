const express = require("express");
const app = express();
const users = require("./routes/users.js");
const post = require("./routes/post.js");

app.use("/users", users);
app.use("/post", users);

app.get("/", (req,res) => {
    res.send("Hi, i am root!");
});


app.listen(3000, () => {
    console.log("app is listning to port 3000");
});