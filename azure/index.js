require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"]
});

const port = process.env.PORT || 8080;

const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
app.use(require("body-parser").json());
const DB = require("./database.js");
let dbClient = null;

let ownerCommands = [];
let visitorRequests = [];

function createId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  })
);
DB.connectMongoDB()
  .then(async function(client) {
    console.log("DB connected");
    await DB.loadCommandsAndRequests(client, ownerCommands, visitorRequests);

    /*
      Format=> {
      "request":"register",
      "device":"device e.g. android",
      "beacon":"beacon-adress if beacon is device",
      }
    */
    app.post("/azure/device", async (req, res) => {
      const body = req.body;
      const response = { success: false };
      if (body.request === "register") {
        if ((body.device === "beacon" && body.beacon) || (body.device !== "beacon" && !body.beacon)) {
          const device = {
            id: createId(),
            auth: body.auth || createId().toUpperCase(),
            beacon: body.beacon,
            device: body.device
          };
          const insertRes = await DB.insertInto(dbClient, "devices", device);
          response.success = insertRes.success === true;
          response.device = device;
        }
      }
      res.send(response);
    });

    authenticate = async (req, res, next) => {
      if (req.query.auth) {
        const res = DB.checkAuth(client, req.query.auth);
        if (res) {
          return next();
        }
      }
      res.send("Not authenticated");
      next("Not authenticated");
    };

    /*
  Format=> {
	"request":"open-door",
	"sender":"device e.g. android",
	"beacon":"beacon-adress"
  }
 */

    app.use(authenticate);

    app.post("/azure/visitor", async (req, res) => {
      const body = req.body;
      const response = { success: false };
      const { auth } = req.query;
      if (body.request === "open-door") {
        body.auth = auth;
        const insertRes = await DB.insertInto(dbClient, "visitor", body);
        visitorRequests.push(body);
        response.success = insertRes.success === true;
      } else if (body.request === "delete") {
        visitorRequests = visitorRequests.filter(item => item.auth !== auth);
        ownerCommands = ownerCommands.filter(item => item.auth !== auth);
        DB.deleteByAuth(dbClient, "visitor", auth);
        DB.deleteByAuth(dbClient, "owner", auth);
      }
      res.send(response);
    });

    app.post("/azure/visitor/file", async (req, res) => {
      if (Object.keys(req.files).length == 0) {
        return res.send({ success: false, info: "no files uploaded" });
      }
      let sampleFile = req.files.beep;
      sampleFile.mv("./upload/" + req.query.auth + ".wav", function(err) {
        if (err) return res.send(err);
        res.send({ success: true });
      });
    });

    app.get("/azure/owner", (req, res) => {
      if (visitorRequests.length > 0) {
        const foundRequests = visitorRequests.find(item => item.auth == req.query.auth);
        res.send(foundRequests);
      } else {
        res.send({ success: false });
      }
    });

    /*
  Format=> {
	"command":"open-door",
  "for":"beacon"
  }
 */

    app.post("/azure/owner", async (req, res) => {
      const body = req.body;
      const response = { success: false };
      console.log(body.command === "open-door");
      console.log(body.command);
      if (body.command === "open-door") {
        body.auth = req.query.auth;
        const insertRes = await DB.insertInto(dbClient, "owner", body);
        ownerCommands.push(body);
        response.success = insertRes.success == true;
      }
      res.send(response);
    });

    app.get("/azure/visitor", (req, res) => {
      if (ownerCommands.length > 0) {
        const foundCommands = ownerCommands.find(item => item.auth == req.query.auth);
        res.send(foundCommands);
      } else {
        res.send({ success: false });
      }
    });

    dbClient = client;
    app.listen(port, function() {
      console.log("Example app listening on port " + port + "!");
    });
    process.on("exit", function() {
      client.close();
    });
  })
  .catch(function(err) {
    console.error("Error occured: ", err);
  });
