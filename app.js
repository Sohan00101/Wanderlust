const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(mongoUrl);
};

app.set("view enginee","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/" ,(req,res) => {
    res.send("app is working.");
});


app.use("/listing", liting);

app.use("/listing/:id/review", review);




app.all("/*splat",(req,res,next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res,next) => {
    let{statusCode = 500, message = "Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080, () => {
    console.log("app is listening to port 8080");
});