const db = require("../db/connection");
const fsp = require("fs/promises");
const format = require("pg-format");

exports.selectAllTopics = () => {
  let query = "SELECT * FROM topics;";

  return db.query(query).then((topics) => {
    return topics.rows;
  });
};

exports.selectArticleById = (article_id, comment_count) => {
  const validCommentCount = ["true", "false"];

  let query = "SELECT ";

  if (/^[0-9]+$/.test(article_id) === false) {
    return Promise.reject({ status: 400, msg: "Incorrect id type" });
  }

  if (comment_count && !validCommentCount.includes(comment_count)) {
    return Promise.reject({ status: 400, msg: "Incorrect query value" });
  }

  if (comment_count) {
    query += "COUNT(comments.comment_id)::INT AS comment_count FROM comments ";
  } else {
    query += "* FROM articles ";
  }
  query += "WHERE article_id = $1 ;";

  return db.query(query, [article_id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article id not found" });
    }
    return article.rows[0];
  });
};

exports.selectAllArticles = (topic, sort_by, order) => {
  const queryValues = [];
  const validSortBy = ["created_at", "votes", "comment_count"];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort by value" });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order value" });
  }

  return selectAllTopics()
    .then((validTopics) => {
      if (topic && !validTopics.includes(topic)) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }

      let query =
        "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ";

      if (topic) {
        query += "WHERE topic = $1 ";
        queryValues.push(topic);
      }

      query +=
        "GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ";

      query += `ORDER BY ${sort_by} ${order.toUpperCase()} ;`;

      return db.query(query, queryValues);
    })
    .then((articles) => {
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

const selectAllTopics = () => {
  let query = "SELECT slug FROM topics;";
  return db.query(query).then((topics) => {
    const validTopics = topics.rows.map((topic) => topic.slug);
    return validTopics;
  });
};
