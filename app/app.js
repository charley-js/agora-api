const express = require("express");
const {
  getAllTopics,
  getAllEndpoints,
  getArticleById,
  getAllArticles,
  getCommentsForArticle,
  createComment,
  updateArticle,
} = require("./app.controller");

const app = express();
app.use(express.json());

//End points
app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.post("/api/articles/:article_id/comments", createComment);

app.patch("/api/articles/:article_id", updateArticle);

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
  if (err.code) {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

module.exports = app;
