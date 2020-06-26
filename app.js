const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  PORT = 3000;

// load the env vars
require("dotenv").config();
// connect to the MongoDB with mongoose
require("./config/database");

app.set("view engine", "ejs");
app.use(express.static("public"));

//************ middleware ***********
// this is how to get rec.body working in express
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

//************** schema *********************
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

//**************************** */

/************  restful routes ******** */

// home route
app.get("/", function (req, res) {
  res.redirect("/blogs");
});

// index route
app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

// new route
app.get("/blogs/new", function (req, res) {
  res.render("new");
});

//create route
app.post("/blogs", function (req, res) {
  //create blog
  Blog.create(req.body.blog, function (err, blog) {
    if (err) {
      console.log(err);
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

// ************************
// turn on server listening
app.listen(PORT, function () {
  console.log(`server listening at port: ${PORT}`);
});
