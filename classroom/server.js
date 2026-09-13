const express = require("express");
const app = express();
const users = require("./routes/users.js");
const post = require("./routes/post.js");
const session  = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view enginee","ejs");
app.set("views",path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretstring", 
    resave:false, 
    saveUninitialized:true
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/register", (req,res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous") {
        req.flash("error", "You are anonymous user");
    }
    else {
        req.flash("success", "User registered successfully!");
    }
    res.redirect("/hello");
});

app.get("/hello", (req,res) => {
    res.render("page.ejs", { name: req.session.name });
});

//app.get("/reqcount", (req,res) => {
//    if(req.session.count) {
//        req.session.count ++
//    }
//    else {
//        req.session.count = 1;
//    }
//    res.send(`you set a request ${req.session.count} times`);
//});

app.listen(3000, () => {
    console.log("app is listning to port 3000");
});