const mongoose = require("mongoose");

// ! require [commentsCollection,replyId,commentId] as query string
exports.deleteReply = async (req, res, next) => {
  
  let keys  = ["commentsCollection","replyId","commentId"];

  for (let key of keys) {
    if (!req.query[key]) {
      return res.status(400).send();
    }
  }

  console.log(req.query);
  try {
    await mongoose
      .model(req.query.commentsCollection)
      .findOneAndUpdate(
        { _id: req.query.commentId },
        { $pull: { replies: { _id: req.query.replyId } } }
      );
    res.status(200).send({ message: "reply deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
};
