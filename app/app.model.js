const db = require("../db/connection");
const fsp = require("fs/promises");

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

exports.selectAllArticles = () => {
  let query =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ORDER BY articles.created_at DESC;";

  return db.query(query).then((articles) => {
    return articles.rows;
  });
};

exports.selectCommentsByArticle = (article_id) => {
  let query = "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC";

  return db.query(query, [article_id]).then((comments) => {
    return comments.rows;
  });
};
