const mongoose = require("mongoose");

exports.upload_new_cover_or_profile_picture = async (req, res, next) => {
  if (!picture_type || !picture_ref) {
    return res.status(400).send({ message: "invalid upload data" });
  }
  let session = await mongoose.startSession();
  try {
    await session
      .withTransaction(async () => {
        let { field_name, picture_ref } = req.body;

        await mongoose.model(req.data.account_type).updateOne(
          { _id: req.data._id },
          {
            $set: {
              [field_name]: picture_ref,
            },
          },
          { session }
        );

        let isAcademic = checkIsAcademic(req.data.account_type);

        mongoose.model(isAcademic ? "uniusers" : "schusers").updateOne(
          {
            _id: req.data._id,
          },
          {
            $set: {
              [field_name]: picture_ref,
            },
          },
          { session }
        );
        res.status(200).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ err });
      });
  } finally {
    session.endSession(() => console.log("session of uploading media ended"));
  }
};
