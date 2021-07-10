const mongoose = require("mongoose");
const {
  getProperUUID,
  getAllUsersCollection,
} = require("../../../../services/helper_functions");

// ! require id factor and collection as query string
exports.fetchQuizHeadersOnRefresh = async (req, res) => {
  if (!req.query.collection || req.query.idFactor) {
    return res.status(400).send({ message: "invalid data" });
  }
  let uuidMatcher = getProperUUID(req.data.account_type, req.data.uuid);
  try {
    let data = await mongoose
      .model(req.query.collection)
      .find(
        {
          _id: { $gt: req.data.idFactor },
          uuid: uuidMatcher,
        },
        { questions: false }
      )
      .populate("author", "", getAllUsersCollection(req.data.account_type))
      .sort("_id")
      .limit(10)
      .lean();
    data.forEach((item) => (item.questions = []));
    res.status(200).send({ data });
  } catch (err) {
    return res.status(500).send({ err });
  }
};
