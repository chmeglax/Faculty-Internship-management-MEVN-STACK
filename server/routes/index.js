const express = require("express");
const app = express();

app.use("/admin", require('./admin'))
app.use("/student", require('./student'))

module.exports = app