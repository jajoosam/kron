const express = require("express");
var mustacheExpress = require("mustache-express");
const axios = require("axios");
const isbot = require("isbot");
const nanoID = require("nanoid");
const app = express();
const port = 3000;

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

var active = 0;

let toCall = {};

let IDs = {};

app.get("/", (req, res) => {
  if (
    (req.query.time || req.query.date) &&
    req.query.url &&
    !isbot(req.headers["user-agent"])
  ) {
    const kronID = nanoID();
    let date = "";
    if (req.query.date) {
      date = new Date(req.query.date).toGMTString();
      if (date === "Invalid Date") {
        return res.send({
          error: true,
          message: "You provided an invalid date 😕"
        });
      }
    } else if (!isNaN(parseInt(req.query.time))) {
      date = new Date();
      date.setSeconds(date.getSeconds() + parseInt(req.query.time));
      date = date.toGMTString();
    } else {
      return res.send({
        error: true,
        message: "You provided an invalid date 😕"
      });
    }
    IDs[kronID] = { date: date, url: req.query.url };
    if (toCall.hasOwnProperty(date)) {
      toCall[date].push(kronID);
    } else {
      toCall[date] = [kronID];
    }
    console.log(toCall);
    return res.send({
      error: false,
      message: kronID
    });
  } else {
    return res.render("index", { current: active });
  }
});

const go = () => {
  let date = new Date().toGMTString();
  if (toCall.hasOwnProperty(date)) {
    toCall[date].forEach(id => {
      axios.get(IDs[id].url);
      console.log(`✅ Completed ${id}`);
      delete toCall[date];
    });
  }
};

setInterval(go, 1000);

app.get("/delete", function(req, res) {
  if (req.query.id) {
    let kron = IDs[req.query.id];
    let date = toCall[kron.date];
    date = date.filter(e => e != req.query.id);
    toCall[kron.date] = date;
    console.log(`🗑️ Deleted ${req.query.id}`);
    return res.send({
      error: false,
      message: "Successfully Deleted 🗑️"
    });
  }
});

app.get("*", function(req, res) {
  res.status(404).send(`🤷 - what are you even trying to do?`);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
