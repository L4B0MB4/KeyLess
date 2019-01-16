var mongoClient = require("mongodb").MongoClient;

var url = process.env.MONGODB || "mongodb://localhost:27017";
function connectMongoDB() {
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
}

module.exports = { connectMongoDB };
