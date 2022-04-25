require("module-alias/register");
const cors = require("cors");
const errorHundler = require('@helpers/errorHundler')
const passport=require("passport");
// parse env variables
require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");


mongoose.Promise = global.Promise;

require('@helpers/connections')
require("./config/passport");

app.use(cors({ origin: '*' }));
app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

var routes = require("./routes");
app.use(routes)
app.use(errorHundler)

var server = require('http').createServer(app);

server.listen(port, () => {
  console.log("listening port => ", port);
});