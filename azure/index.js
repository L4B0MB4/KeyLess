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
  .then(function(client) {
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

    app.get("/azure/owner", authenticate, (req, res) => {
      if (visitorRequests.length > 0) {
        res.send(visitorRequests);
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

    app.post("/azure/owner", (req, res) => {
      const body = req.body;
      const response = { sucess: false };
      if (body.command === "open-door") {
        ownerCommands.push(body);
        response.sucess = true;
      }
      res.send(response);
    });

    app.get("/azure/visitor", (req, res) => {
      if (ownerCommands.length > 0) {
        res.send(ownerCommands);
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

    app.post("/azure/visitor", (req, res) => {
      const body = req.body;
      const response = { sucess: false };
      if (body.request === "open-door") {
        visitorRequests.push(body);
        response.sucess = true;
      }
      res.send(response);
    });

    app.get("/azure/insert", (req, res) => {
      DB.testInsert(dbClient)
        .then(function(val) {
          res.send(val);
        })
        .catch(function(err) {
          res.send(err);
        });
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
