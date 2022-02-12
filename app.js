// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("uz-UZ", options);
  res.render("list", { kindOfDay: day, newListItems: items });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  res.redirect("/");

  items.push(item);
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
