const express = require("express");
const mustacheExpress = require("mustache-express");
const axios = require("axios");
const parse = require("parse-duration");
const querystring = require("querystring");
const distance = require("date-fns/formatDistanceToNow");
const nanoID = require("nanoid");
const MongoClient = require("mongodb").MongoClient;
let db = null;

const dbURL = `mongodb+srv://${process.env.user}:${process.env.password}@${process.env.url}/test?retryWrites=true&w=majority`;

const client = new MongoClient(dbURL, { useNewUrlParser: true });
client.connect((err, ret) => {
  if (err) throw err;
  console.log("Database created!");
  db = ret.db("kron");
  run();
});

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(express.json());

let toCall = {};
let IDs = {};

app.post(`/new`, (req, res) => {
  if ((req.body.duration || req.body.date) && req.body.url) {
    const kronID = nanoID();
    let date = "";
    if (req.body.date) {
      date = new Date(req.body.date).toGMTString();
      if (date === "Invalid Date") {
        return res.status(400).send({
          error: true,
          message: "You provided an invalid date 😕"
        });
      }
    } else if (!isNaN(parseInt(req.body.duration))) {
      date = new Date();
      date.setSeconds(date.getSeconds() + parse(req.body.duration) / 1000);
      date = date.toGMTString();
    } else {
      return res.status(400).send({
        error: true,
        message: "You provided an invalid date 😕"
      });
    }
    tempKron = {
      date: date,
      url: req.body.url,
      method: "GET",
      payload: null
    };

    db.collection("dates").findOne({ date: date }, function(err, result) {
      if (result !== null) {
        db.collection("dates").updateOne(
          { date: date },
          { $push: { IDs: kronID } }
        );
      } else {
        db.collection("dates").insertOne({ date: date, IDs: [kronID] });
      }
    });

    if (req.body.method === "POST") {
      tempKron.method = "POST";
    }
    if (req.body.payload) {
      tempKron.payload = req.body.payload;
    }

    db.collection("IDs").insertOne({ id: kronID, ...tempKron });

    return res.status(200).send({
      error: false,
      message: kronID,
      scheduled: date
    });
  } else {
    return res.status(400).send({
      error: true,
      message: "Required parameters missing 😕"
    });
  }
});

app.post(`/delete`, (req, res) => {
  if (req.body.id) {
    db.collection("IDs").findOne({ id: req.body.id }, function(err, kron) {
      if (kron === null) {
        return res.status(400).send({
          error: true,
          message:
            "You supplied an invalid ID - it is possible we've already sent a request 😕"
        });
      }
      db.collection("dates").updateOne(
        { date: kron.date },
        { $pull: { IDs: kron.id } }
      );
      db.collection("IDs").deleteOne({ id: kron.id });
      return res.status(200).send({
        error: true,
        message: "Deleted it 🗑️"
      });
    });
  } else {
    return res.status(400).send({
      error: true,
      message: "An ID is required 😕"
    });
  }
});

app.post(`/status`, (req, res) => {
  if (req.body.id) {
    db.collection("IDs").findOne({ id: req.body.id }, function(err, kron) {
      if (kron === null) {
        return res.status(400).send({
          error: true,
          message:
            "You supplied an invalid ID - it is possible we've already sent a request 😕"
        });
      }
      kron.timeLeft = distance(new Date(kron.date));
      return res.status(200).send({
        error: false,
        message: kron
      });
    });
  } else {
    return res.status(400).send({
      error: true,
      message: "An ID is required 😕"
    });
  }
});

app.get("/", (req, res) => {
  db.collection("IDs").find({}, function(err, results) {
    results.count().then(count => res.render("index", { current: count }));
  });
});

app.get("*", function(req, res) {
  res.status(404).send(`🤷 - what are you even trying to do?`);
});

const go = () => {
  let date = new Date().toGMTString();
  db.collection("dates").findOne({ date: date }, function(err, result) {
    console.log("check");
    if (result !== null) {
      result.IDs.forEach(id => {
        send(id);
      });
      db.collection("dates").deleteOne({ date: date });
    }
  });
};

const send = id => {
  db.collection("IDs").findOne({ id: id }, function(err, kron) {
    if (kron.method === "GET") {
      if (kron.payload && !kron.url.includes(`?`)) {
        kron.url += `?${querystring.stringify(kron.payload)}`;
      }
      axios.get(kron.url, { headers: { "User-Agent": `kron-${id}` } });
    } else if (kron.method === "POST") {
      axios.post(kron.url, kron.payload, {
        headers: { "User-Agent": `kron-${id}` }
      });
    }
    db.collection("IDs").deleteOne({ id: id });
  });
};

const run = () => {
  setInterval(go, 1000);
};

app.listen(3000, () => console.log(`Example app listening on port 3000!`));
