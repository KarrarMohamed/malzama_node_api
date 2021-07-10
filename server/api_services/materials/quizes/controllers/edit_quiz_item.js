const mongoose = require("mongoose");
const { checkIsAcademic } = require("../../../../services/helper_functions");

exports.editQuizItem = async (req, res, next) => {
    let credentials = Object.values(req.body);
  
    for (let value of credentials) {
      if (value.toString() == "null" || !value) {
        return res.status(400).send({ message: "invalid data" });
      }
    }
  
    let collection_name = checkIsAcademic(req.data.account_type)
      ? "uniquizes"
      : "schquizes";
  console.log('quizItem =' + req.body.quizItem.toString());
  console.log('quizItemId =' +req.body.quizItemId);
  console.log('quizCollectionId =' +req.body.quizCollectionId);
    try {
      await mongoose.model(collection_name).updateOne(
        {
          _id: req.body.quizCollectionId,
          "questions._id": req.body.quizItemId,
        },
        {
          $set: {
            "questions.$": {
              
              ...req.body.quizItem,
            },
          },
        }
      );
      res.status(200).send({ message: "quiz item updated successfully" });
    } catch (err) {
      res.status(500).send({ err });
    }
  };