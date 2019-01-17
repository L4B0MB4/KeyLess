var mongoClient = require("mongodb").MongoClient;

var url = process.env.MONGODB || "mongodb://localhost:27017";
exports.connectMongoDB = function() {
  return new Promise(function(res, rej) {
    mongoClient.connect(
      url,
      { useNewUrlParser: true },
      function(err, client) {
        if (err) rej(err);
        console.log("Connected to MongoDB!");
        res(client);
      }
    );
  });
};

exports.testInsert = function(client) {
  var db = client.db("keyless");
  console.log(db);
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
      client.close();
    })
    .catch(function(err) {
      console.log(err);
      client.close();
    });
};
