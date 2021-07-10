const mongoose = require("mongoose");
const { checkIsAcademic } = require("../../../../services/helper_functions");

// fetch quiz items
// ! require [quizId] as query string
exports.fetchAllQuizQuestions = async (req, res, next) => {
  if (!req.query.quizId) {
    return res.status(400).send();
  }

  let collectionName = checkIsAcademic(req.data.account_type)
    ? "uniquizes"
    : "schquizes";

  try {
    let data = await mongoose
      .model(collectionName)
      .findOne({ _id: req.query.quizId }, { _id: false, questions: true }).lean();
    console.log(data.questions.length);
    return res.status(200).send({ data });
  } catch (err) {
    return res.status(500).send({ err });
  }
};
