const mongoose = require("mongoose");
const { checkIsAcademic } = require("../../../../services/helper_functions");

// fetch quizes count
exports.fetchQuizesCount = async (req, res, next) => {

  console.log('fetching count in the server')
  let collectionName = checkIsAcademic(req.data.account_type)
    ? "uniquizes"
    : "schquizes";
  try {
    let count = await mongoose
      .model(collectionName)
      .find({
        uuid: req.data.uuid,
      })
      .countDocuments();
    return res.status(200).send({ data: count });
  } catch (err) {
    return res.status(500).send({ err });
  }
};
