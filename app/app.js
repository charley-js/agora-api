const express = require("express");
const { getAllTopics } = require("./app.controller");

const app = express();
app.use(express.json());

//End points
app.get("/api/topics", getAllTopics);

//Error-handling

app.use((req, res, next) => {
  res.status(404).send({ msg: "Invalid endpoint" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
