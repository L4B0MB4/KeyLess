var mongoClient = require("mongodb").MongoClient;
const DATABASE = "keyless";

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

checkAuth = (client, auth) => {
  return new Promise(async mainRes => {
    var db = client.db(DATABASE);
    var collection = db.collection("authentication");
    const res = await collection.findOne({ auth });
    mainRes(res);
  });
};

insertInto = (client, collectionName, data) => {
  return new Promise(function(mainRes, mainRej) {
    var db = client.db(DATABASE);
    data.db_timestamp = Date.now();
    var collection = db.collection(collectionName);
    collection.insertOne(data, function(err, res) {
      if (err) {
        mainRej(err);
        return;
      }
      mainRes({ success: true });
    });
  });
};

loadCommands = async (client, owner, visitor) => {
  const db = client.db(DATABASE);
  let collection = db.collection("owner");
  const resOwner = await collection.find().toArray();
  collection = db.collection("visitor");
  const resVisitor = await collection.find().toArray();
  owner.push(...resOwner);
  visitor.push(...resVisitor);
};
module.exports = { connectMongoDB, insertInto, checkAuth, loadCommands };
