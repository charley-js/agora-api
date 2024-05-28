const db = require("../db/connection");

exports.selectAllTopics = (req) => {
  if (Object.keys(req.query).length !== 0 || Object.keys(req.params).length !== 0) {
    console.log(req.query, req.params);
    return Promise.reject({ status: 400, msg: "Invalid query or parameter" });
  }
  let query = "SELECT * FROM topics ";

  query += ";";

  return db.query(query).then((topics) => {
    return topics.rows;
  });
};
