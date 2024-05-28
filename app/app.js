const express = require("express");
const { getAllTopics, getAllEndpoints } = require("./app.controller");

const app = express();

//End points
app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

//Error-handling

app.use((req, res, next) => {
  res.status(404).send({ msg: "Invalid endpoint" });
});

module.exports = app;
