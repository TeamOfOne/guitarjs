"use strict";

var express    = require("express");
var bodyParser = require("body-parser");

var app = express();

//Serve static files from wwwroot
app.use(express.static("wwwroot"));

//Parse application/json requests
app.use(bodyParser.json());

//Create and handle the Web CLI route
require("./webcli.js")(app);

//Start server
var server = app.listen(5000, function()
{
    console.log("Listening on port " + server.address().port);
});