const express = require("express");
const { getAllTopics } = require("./app.controller");

const app = express();

//End points
app.get("/api/topics", getAllTopics);

//Error-handling

app.use((req, res, next) => {
  res.status(404).send({ msg: "Invalid endpoint" });
});

module.exports = app;
