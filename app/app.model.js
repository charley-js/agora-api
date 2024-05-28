const db = require("../db/connection");
const fsp = require("fs/promises");

exports.selectAllTopics = (req) => {
  let query = "SELECT * FROM topics ";

  query += ";";

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
