const mongoose = require("mongoose");
const { checkIsAcademic } = require("../../../../services/helper_functions");

// fetch quiz items
// ! require [quizId,skipCount] as query string
exports.fetchQuizQuestions = async (req, res, next) => {
  let keys = ["quizID", "skipCount"];

  for (let key of keys) {
    if (!req.query[key] && req.query[key] != 0) {
      return res.status(400).send();
    }
  }
  let collectionName = checkIsAcademic(req.data.account_type)
    ? "uniquizes"
    : "schquizes";
  // console.log("fetching quiz questions");
  // console.log("quizId ===" + req.query.quizId);
  // console.log("skip count ===" + req.query.skipCount);
  // console.log(req.path);
  try {
    let skipCount = parseInt(req.query.skipCount.toString().trim());
    let data = await mongoose
      .model(collectionName)
      .findOne({ _id: req.query.quizID }, { _id: false, questions: true })
      .slice("questions", [skipCount, 8]);
    console.log(data.questions.length);
    data.questions = data.questions.filter(i => i != null);
    console.log(data);
    return res.status(200).send({ data });
  } catch (err) {
    return res.status(500).send({ err });
  }
};
