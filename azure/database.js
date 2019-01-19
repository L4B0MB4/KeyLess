var mongoClient = require("mongodb").MongoClient;

var url = process.env.MONGODB || "mongodb://localhost:27017";
connectMongoDB = () => {
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

testInsert = client => {
  return new Promise(function(mainRes, mainRej) {
    var db = client.db("keyless");
    var collection = db.collection("devices");
    collection
      .findOne({ name: "test" })
      .then(function(res, rej) {
        if (res) {
          mainRej(res);
        } else {
          collection.insertOne({ name: "test", password: "test" }, function(err, res) {
            if (err) {
              mainRej(err);
              return;
            }
            mainRes(res);
          });
        }
      })
      .catch(function(err) {
        mainRej(err);
      });
  });
};

checkAuth = (client, auth) => {
  return new Promise(async mainRes => {
    var db = client.db("keyless");
    var collection = db.collection("authentication");
    const res = await collection.findOne({ auth });
    mainRes(res);
  });
};

module.exports = { connectMongoDB, testInsert, checkAuth };
