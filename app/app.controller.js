const { selectAllTopics } = require("./app.model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics(req)
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};
