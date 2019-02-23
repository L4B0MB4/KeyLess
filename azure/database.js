var mongoClient = require("mongodb").MongoClient;
const DATABASE = "keyless";

var url = process.env.MONGODB || "mongodb://localhost:27017";
connectMongoDB = () => {
  return new Promise(function(res, rej) {
    mongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
      if (err) rej(err);
      console.log("Connected to MongoDB!");
      res(client);
    });
  });
};

checkAuth = (client, auth, device) => {
  return new Promise(async mainRes => {
    var db = client.db(DATABASE);
    var collection = db.collection("device");
    const res = await collection.findOne({ auth, device });
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

deleteByAuth = (client, collectionName, auth) => {
  return new Promise(async mainRes => {
    var db = client.db(DATABASE);
    var collection = db.collection(collectionName);
    const res = await collection.deleteMany({ auth });
    mainRes(res);
  });
};

loadCommandsAndRequests = async (client, owner, visitor) => {
  const db = client.db(DATABASE);
  let collection = db.collection("owner");
  const resOwner = await collection.find().toArray();
  collection = db.collection("visitor");
  const resVisitor = await collection.find().toArray();
  owner.push(...resOwner);
  visitor.push(...resVisitor);
};
module.exports = {
  connectMongoDB,
  insertInto,
  checkAuth,
  loadCommandsAndRequests,
  deleteByAuth
};
