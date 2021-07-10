const mongoose = require("mongoose");
const { getAllUsersCollection } = require("../../../../services/helper_functions");

exports.fetchSavedVideosOrPDF = async (req, res, next) => {
  if (!req.query.ids || !req.query.collection) {
    console.log('fetch saved material on refresh');
    console.log(req.query);
    return res.status(400).send({ message: "invalid data" });
  }

  try {
    console.log('============================================');
    console.log('fetching saved materials');
    console.log('============================================');

    let idList = req.query.ids.split(",");

    console.log('============================================');
    console.log(idList);
    console.log('============================================');
    let data = await mongoose
      .model(req.query.collection)
      .find({
        _id: { $in: idList },
      })
      .populate("author", "", getAllUsersCollection(req.data.account_type))
      .sort('-_id')
      .lean();

    return res.status(200).send({ data });
  } catch (err) {
      console.log(err);
    return res.status(500).send({ err });
  }
};
