var port = process.env.PORT || 8080;

var express = require("express");
var app = express();
app.use(require("body-parser").json());

var ownerCommands = [];
var visitorRequests = [];

app.get("/owner", function(req, res) {
  res.send(visitorRequests);
});

/*
  Format=> {
	"command":"open-door",
	"for":"beacon"
  }
 */

app.post("/owner", function(req, res) {
  var body = req.body;
  var response = { sucess: false };
  if (body.command === "open-door") {
    ownerCommands.push(body);
    response.sucess = true;
  }
  res.send(response);
});

app.get("/visitor", function(req, res) {
  res.send(ownerCommands);
});

/*
  Format=> {
	"request":"open-door",
	"sender":"device e.g. android",
	"beacon":"beacon-adress"
  }
 */

app.post("/visitor", function(req, res) {
  var body = req.body;
  var response = { sucess: false };
  if (body.request === "open-door") {
    visitorRequests.push(body);
    response.sucess = true;
  }
  res.send(response);
});

app.listen(port, function() {
  console.log("Example app listening on port " + port + "!");
});
