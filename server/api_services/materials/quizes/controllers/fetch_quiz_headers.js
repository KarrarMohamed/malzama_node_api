const mongoose = require("mongoose");
const {
  checkIsAcademic,
  getAllUsersCollection,
  getPaginationIdFactor,
  getProperUUID,
} = require("../../../../services/helper_functions");

// fetch quiz credentials

// ! require idFactor as query string
exports.fetchQuizesHeaders = async (req, res, next) => {
  try {
    let collectionName = checkIsAcademic(req.data.account_type)
      ? "uniquizes"
      : "schquizes";

    let idFactor = getPaginationIdFactor(req.query.idFactor);
    let uuidMatcher = getProperUUID(req.data.account_type, req.data.uuid);
    let data = await mongoose
      .model(collectionName)
      .find({ _id: { $lt: idFactor }, uuid: uuidMatcher }, { questions: false })
      .populate("author", "", getAllUsersCollection(req.data.account_type))

      .sort("-_id")
      .limit(10)
      .lean();
    data.forEach((item) => (item.questions = []));
    res.status(200).send({ data });
  } catch (err) {
    console.log("error while fucking ...");
    console.log(err);
    res.status(500).send({ err });
  }
};
