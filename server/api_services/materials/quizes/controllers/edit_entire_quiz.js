const mongoose = require("mongoose");

exports.editEntireQuiz = async (req, res) => {
  let { updateType, _id, collectionName } = req.body;

  let updatePayload = { ...req.body };
  delete updatePayload["_id"];
  delete updatePayload["collectionName"];
  delete updatePayload["updateType"];
  delete updatePayload["questions"];
  delete updatePayload["questionsCount"];

  let questions = [];
  let ids_list = [];
  if (updateType) {
    req.body.questions.forEach((i) => {
      let quizEntity = i;
      quizEntity._id = mongoose.Types.ObjectId();
      ids_list.push(quizEntity._id);
      questions.push(quizEntity);
    });

    updatePayload["questionsCount"] = req.body.questionsCount;

    if (updateType == "set") {
      updatePayload.questions = questions;
    }
  }

  try {
    if (updateType == null || updateType == "set") {
      console.log("setting new collection");
      console.log("questions count updated = " + questions.length.toString());
      await mongoose.model(collectionName).updateOne(
        { _id: _id },
        {
          $set: { ...updatePayload },
        }
      );

      return res.status(200).send({ data: { ids_list } });
    } else {
      console.log("questions count updated = " + questions.length.toString());
      await mongoose.model(collectionName).updateOne(
        { _id: _id },
        {
          $set: { ...updatePayload },
          $push: {
            questions: questions,
          },
        }
      );

      return res.status(200).send({ data: { ids_list } });
    }
  } catch (err) {
    return res.status(500).send({ err });
  }
};
