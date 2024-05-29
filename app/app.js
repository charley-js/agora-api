const express = require("express");
const {
  getAllTopics,
  getAllEndpoints,
  getArticleById,
  getAllArticles,
  getCommentsForArticle,
} = require("./app.controller");

const app = express();

//End points
app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

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

module.exports = app;
