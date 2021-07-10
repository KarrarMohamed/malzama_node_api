const mongoose = require("mongoose");
const { checkIsAcademic } = require("../../../../services/helper_functions");

// ! require [quizItemID , quizCollectionID,questionsCount] as query string
exports.deleteQuizItem = async (req, res, next) => {

  let keys = ["quizItemId" , "quizCollectionId","questionsCount"];

  for(let key of keys){
    if(!req.query[key]){
      return res.status(400).send();
    }
  }

  // console.log("==========================================");
  // console.log("deleting quiz item");
  // console.log(req.query.quizItemID);
  // console.log(req.query.quizCollectionID);
  // console.log("==========================================");
  

  let collection_name = checkIsAcademic(req.data.account_type)
    ? "uniquizes"
    : "schquizes";
  console.log(collection_name);
  try {
    await mongoose.model(collection_name).findOneAndUpdate(
      { _id: req.query.quizCollectionId },
      {
        $pull: {
          questions: { _id: req.query.quizItemId },
        },
        $set: {
          questionsCount: req.query.questionsCount,
        },
      },
      { useFindAndModify: false }
    );
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ err });
  }
};
