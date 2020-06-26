const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  PORT = 3000,
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer");

// load the env vars
require("dotenv").config();
// connect to the MongoDB with mongoose
require("./config/database");

// configure app
//************ middleware ***********
app.set("view engine", "ejs");
app.use(express.static("public"));
// this is how to get rec.body working in express
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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
  //sanitize so no rogue scripts get in
  req.body.blog.body = req.sanitize(req.body.blog.body);
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

//show route
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: blog });
    }
  });
});

//edit route
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: blog });
    }
  });
});

// update route
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, blog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("blogs" + req.params.id);
    }
  });
});

// delete route
// #rawr DESTROY!!!!!!!!!
app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
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
