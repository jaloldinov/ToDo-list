// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const date = require(__dirname + "/data.js");
const _ = require("lodash");



const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true})

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema)

const day1 = new Item ({
  name: "Welcome to your ToDo List"
})

const day2 = new Item ({
  name: "Hit the + button"
})

const day3 = new Item ({
  name: "<-- Click checkbox"
})

const defaultItems = [day1, day2, day3]

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if(foundItems.length === 0) {
      Item.insertMany(defaultItems, error => {
        if (error) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
    }) 
      res.redirect("/");
    } else {
      res.render("list", {listTitle: day, newListItems: foundItems  });
    }
  })

  const day = date.getDate();
  
  });

  app.get("/:paramName", function(req, res) {

    const paramName = _.capitalize(req.params.paramName);

    List.findOne({name: paramName}, function(err, foundList) {
      if(!err) {
        if(!foundList) {
          const list = new List({
            name: paramName,
            items: defaultItems
          })

          list.save();
          res.redirect("/" + paramName);
        } else {
          res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
      }
    })
  })

  
  app.post("/", function(req, res){
  const day = date.getDate();
  
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item ({
      name: itemName
    });

    if(listName === day) {
      item.save();
      res.redirect("/");
    } else {

      List.findOne({name: listName}, function(err, foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      })
    }

  });

  app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    const day = date.getDate();

    if(listName === day) {
      Item.findByIdAndRemove(checkedItemId, err => {
        if (!err) {
          console.log("Successfully deleted checked item.");
          res.redirect("/");
        } else {
          console.log(err);
        }
      })
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        }
      })
    }
  })
  


  
  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  