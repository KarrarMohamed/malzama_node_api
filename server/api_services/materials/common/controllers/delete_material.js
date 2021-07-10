const mongoose = require("mongoose");
const { checkIsAcademic } = require("../../../../services/helper_functions");

//! require [id , fieldName] as queryString

exports.deleteMaterial = async (req, res, next) => {


  let keys = ["id","collectionName"];
  for (let key of keys) {
    if (!req.query[key]) {
      return res.status(400).send();
    }
  }


  let fieldName = req.query.collectionName.substring(3);

  let session = await mongoose.startSession();

  try {
    await session
      .withTransaction(async () => {
        await mongoose
          .model(req.query.collectionName)
          .deleteOne({ _id: req.query.id }, { session });
        await mongoose.model(req.data.account_type).findOneAndUpdate(
          { _id: req.data._id },
          {
            $pull: { [fieldName]: req.query.id },
          },
          { useFindAndModify: false, session: session }
        );
        return res.status(200).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ err });
      });
  } finally {
    session.endSession(() =>
      console.log("session of deleting a material has been ended")
    );
  }
};
