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
      return Promise.reject({ status: 404, msg: "Author id invalid" });
    }
    return article.rows;
  });
};
