var mongoClient = require("mongodb").MongoClient;

var url = process.env.MONGODB || "mongodb://localhost:27017";
mongoClient.connect(
  url,
  { useNewUrlParser: true },
  function(err, client) {
    if (err) throw err;
    console.log("Connected to MongoDB!");
    var db = client.db("keyless");
    var collection = db.collection("devices");
    collection
      .findOne({ name: "test" })
      .then(function(res, rej) {
        if (res) {
          console.log(res);
        } else {
          collection.insertOne({ name: "test", password: "test" }, function(err, res) {
            if (err) {
              console.log(err);
              return;
            }
            console.log(res);
          });
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
);
