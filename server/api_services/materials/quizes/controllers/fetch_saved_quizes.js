const mongoose = require("mongoose");
const { getAllUsersCollection } = require("../../../../services/helper_functions");

exports.fetchSavedQuizesHeaders = async (req, res, next) => {
  console.log('fetching saved quizes');
  if (!req.query.collection || !req.query.ids) {
    return res.status(400).send({ message: "invalid data" });
  }

  let idList = req.query.ids.split(",");

  try {
    let data = await mongoose
      .model(req.query.collection)
      .find(
        {
          _id: { $in: idList },
        },
        { questions: false }
      )
      .populate("author", "", getAllUsersCollection(req.data.account_type))
      .lean();
    data.forEach((item) => (item.questions = []));
    return res.status(200).send({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};
