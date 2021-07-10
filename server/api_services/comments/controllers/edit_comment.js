const mongoose = require("mongoose");

exports.editComment = async (req, res, next) => {
  try {
    let updatedComment = await mongoose
      .model(req.body.comments_collection)
      .findOneAndUpdate(
        { _id: req.body.comment_id },
        { $set: { content: req.body.comment_content } },
        { useFindAndModify: false, new: true }
      );
      console.log(updatedComment);
    res.status(200).send({ updatedComment });
  } catch (err) {
    res.status(500).send({ err });
  }
};
