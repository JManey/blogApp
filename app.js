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
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

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
// Blog.create({
//     title: "puppies rock!",
//   image: "https://images.unsplash.com/photo-1582068955580-dcc6c0812b21?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//   body: "I love dogs and yo should too.  I mean who wouldn't?",
// })

/************  restful routes ******** */

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

// ************************
// turn on server listening
app.listen(PORT, function () {
  console.log(`server listening at port: ${PORT}`);
});
