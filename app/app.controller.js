const { selectAllTopics, readEndpoints } = require("./app.model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics(req)
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllEndpoints = (req, res, next) => {
  readEndpoints()
    .then((endpoints) => {
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      next(err);
    });
};
