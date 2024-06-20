const {
  selectAllTopics,
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticle,
  insertComment,
  updateArticleVotes,
  deleteCommentById,
  selectCommentById,
  selectAllUsers,
} = require("./app.model");

const fsp = require("fs/promises");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllEndpoints = (req, res, next) => {
  return fsp
    .readFile("endpoints.json", "utf-8")
    .then((endpoints) => {
      res.status(200).send(JSON.parse(endpoints));
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { comment_count } = req.query;
  selectArticleById(article_id, comment_count)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by = "created_at", order = "desc" } = req.query;
  selectAllArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(() => {
      return selectCommentsByArticle(article_id);
    })
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.createComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  selectArticleById(article_id)
    .then(() => {
      return insertComment(article_id, comment);
    })
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  selectArticleById(article_id)
    .then(() => {
      return updateArticleVotes(article_id, inc_votes);
    })
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  selectCommentById(comment_id)
    .then(() => {
      return deleteCommentById(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};
