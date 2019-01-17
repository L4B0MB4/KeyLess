var port = process.env.PORT || 8080;

var express = require("express");
var app = express();
app.use(require("body-parser").json());
var DB = require("./database.js");
var dbClient = null;

var ownerCommands = [];
var visitorRequests = [];

app.get("/azure/owner", function(req, res) {
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

app.post("/azure/owner", function(req, res) {
  var body = req.body;
  var response = { sucess: false };
  if (body.command === "open-door") {
    ownerCommands.push(body);
    response.sucess = true;
  }
  res.send(response);
});

app.get("/azure/visitor", function(req, res) {
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

app.post("/azure/visitor", function(req, res) {
  var body = req.body;
  var response = { sucess: false };
  if (body.request === "open-door") {
    visitorRequests.push(body);
    response.sucess = true;
  }
  res.send(response);
});

app.get("/azure/insert", function(req, res) {
  DB.testInsert(dbClient)
    .then(function(val) {
      res.send(val);
    })
    .catch(function(err) {
      res.send(err);
    });
});

DB.connectMongoDB()
  .then(function(client) {
    dbClient = client;
    app.listen(port, function() {
      console.log("Example app listening on port " + port + "!");
    });
    process.on("exit", function() {
      client.close();
    });
  })
  .catch(function(err) {
    console.errror(err);
  });
