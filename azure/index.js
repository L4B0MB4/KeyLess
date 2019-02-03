require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"]
});

const port = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(require("body-parser").json());
const DB = require("./database.js");
let dbClient = null;

const ownerCommands = [];
const visitorRequests = [];

DB.connectMongoDB()
  .then(async function(client) {
    await DB.loadCommandsAndRequests(client, ownerCommands, visitorRequests);

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

    app.use(authenticate);

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

    /*
  Format=> {
	"request":"open-door",
	"sender":"device e.g. android",
	"beacon":"beacon-adress"
  }
 */

    app.post("/azure/visitor", async (req, res) => {
      const body = req.body;
      const response = { success: false };
      if (body.request === "open-door") {
        body.auth = req.query.auth;
        const insertRes = await DB.insertInto(dbClient, "visitor", body);
        visitorRequests.push(body);
        response.success = insertRes.success === true;
      }
      res.send(response);
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
