var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://bitch:lasagna@krona-l3pqs.mongodb.net/test?retryWrites=true&w=majority";
let db = null;
MongoClient.connect(url, function(err, ret) {
  if (err) throw err;
  console.log("Database created!");
  db = ret.db("kron");
  run();
});

const run = () => {
  db.collection("dates").findOne({ date: "never" }, function(err, result) {
    if (err) throw err;
    console.log(result.name);
    db.close();
  });
};
