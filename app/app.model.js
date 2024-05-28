const db = require("../db/connection");

exports.selectAllTopics = (req) => {
  let query = "SELECT * FROM topics ";

  query += ";";

  return db.query(query).then((topics) => {
    return topics.rows;
  });
};
