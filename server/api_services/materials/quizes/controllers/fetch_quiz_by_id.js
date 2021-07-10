const mongoose = require("mongoose");

// ! require id as query string
exports.fetchQuizById = async (req, res, next) => {
  if (!req.query.id) {
    return res.status(400).send();
  }

  let collectionName = checkIsAcademic(req.data.account_type)
    ? "uniquizes"
    : "schquizes";

  let data = await mongoose.model(collectionName).findOne(
    {
      _id: req.query.id,
    },
    { questions: false }
  );
  if (data) {
    data.questions = [];
  }
  return res.status(200).send({data});
};
