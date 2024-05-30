const db = require("../db/connection");
const fsp = require("fs/promises");
const format = require("pg-format");

exports.selectAllTopics = () => {
  let query = "SELECT * FROM topics;";

  return db.query(query).then((topics) => {
    return topics.rows;
  });
};

exports.readEndpoints = () => {
  return fsp
    .readFile("/home/charley-js/Northcoders/be-project/be-nc-news/endpoints.json", "utf-8")
    .then((endpoints) => {
      return JSON.parse(endpoints);
    });
};

exports.selectArticleById = (article_id) => {
  if (/^[0-9]+$/.test(article_id) === false) {
    return Promise.reject({ status: 400, msg: "Incorrect id type" });
  }
  let query = "SELECT * FROM articles WHERE article_id = $1 ;";

  return db.query(query, [article_id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Author id not found" });
    }
    return article.rows;
  });
};

exports.selectAllArticles = (topic) => {
  const queryValues = [];
  const validTopics = ["cats", "mitch", "coding", "football", "cooking"];

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 404, msg: "Topic not found" });
  }

  let query =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ";

  if (topic) {
    query += "WHERE topic = $1";
    queryValues.push(topic);
  }

  query +=
    "GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ORDER BY articles.created_at DESC ;";

  return db.query(query, queryValues).then((articles) => {
    return articles.rows;
  });
};

exports.selectCommentsByArticle = (article_id) => {
  let query = "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC";

  return db.query(query, [article_id]).then((comments) => {
    return comments.rows;
  });
};

exports.insertComment = (article_id, comment) => {
  if (!("username" in comment) || !("body" in comment) || Object.keys(comment).length === 0) {
    return Promise.reject({ status: 400, msg: "Invalid comment format" });
  }
  const formattedComment = [[article_id, comment.username, comment.body]];

  let query = format("INSERT INTO comments (article_id, author, body) VALUES %L RETURNING *;", formattedComment);

  return db.query(query).then((result) => {
    return result.rows[0];
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  let query = "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;";
  return db.query(query, [article_id, inc_votes]).then((article) => {
    return article.rows[0];
  });
};

exports.deleteCommentById = (comment_id) => {
  let query = "DELETE FROM comments WHERE comment_id = $1;";
  return db.query(query, [comment_id]);
};

exports.selectCommentById = (comment_id) => {
  if (/^[0-9]+$/.test(comment_id) === false) {
    return Promise.reject({ status: 400, msg: "Incorrect id type" });
  }
  let query = "SELECT * FROM comments WHERE comment_id = $1;";
  return db.query(query, [comment_id]).then((comment) => {
    if (comment.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Comment id not found" });
    } else {
      return comment.rows;
    }
  });
};

exports.selectAllUsers = () => {
  let query = "SELECT * FROM users;";

  return db.query(query).then((users) => {
    return users.rows;
  });
};
