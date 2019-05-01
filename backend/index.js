var express = require("express");
var app = express();
var bodyParser = require("body-parser");
//var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
app.set("view engine", "ejs");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// app.use(
//   session({
//     secret: "cmpe273_kafka_passport_mongo",
//     resave: false,
//     saveUninitialized: false,
//     duration: 60 * 60 * 1000,
//     activeDuration: 5 * 60 * 1000
//   })
// );

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.get("/api/graph", function(req, res) {
  var request = require("request");

  var options = {
    method: "GET",
    url: "http://api.worldbank.org/countries/USA/indicators/NY.GDP.MKTP.CD",
    qs: { per_page: "5000", format: "json" },
    headers: {}
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    res.json(body);
    //  console.log(body);
  });
});

app.listen(3001);
console.log("Server Listening on port 3001");
