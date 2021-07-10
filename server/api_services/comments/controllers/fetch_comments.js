const mongoose = require("mongoose");
const {
  getAllUsersCollection,
} = require("../../../services/helper_functions");


exports.fetchComments = async (req, res, next) => {

  let keys = ['collection','ids'];

  for(let key of keys){
    if(!req.query[key]){
      return res.status(400).send();
    }
  }
  let allUsersCollection = getAllUsersCollection(req.data.account_type);
  let listOfIDs = req.query.ids.split(',')
  try {
    mongoose.model;
    let data = await mongoose
      .model(req.query.collection)
      .find({
        _id: { $in: listOfIDs },
      })
      .populate("author", "", allUsersCollection)
      .populate("replies.reply_author", "", allUsersCollection)
      .populate("ratings.rating_author", "", allUsersCollection);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ err });
  }
};


