const mongoose = require("mongoose");

// ! require [materialCollection,materialId,commentsCollection,commentId] as query string
exports.deleteComment = async (req, res, next) => {
  let keys = [
    "materialCollection",
    "materialId",
    "commentsCollection",
    "commentId",
  ];

  for (let key of keys) {
    if (!req.query[key]) {
      return res.status(400).send();
    }
  }
  let session = await mongoose.startSession();

  try {
    await session
      .withTransaction(async () => {
        await mongoose.model(req.query.materialCollection).updateOne(
          { _id: req.query.materialId },
          {
            $pull: { comments: req.query.commentId },
          },
          { session }
        );

        await mongoose
          .model(req.query.commentsCollection)
          .deleteOne({ _id: req.body.commentId }, { session });

        res.status(200).send({ message: "comment deleted successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ err });
      });
  } finally {
    session.endSession(() => console.log("session of deleting comment ended"));
  }
};
