var jwt = require("jsonwebtoken");
var { secretToken } = require("../../../middleware/validation");
const mongoose = require("mongoose");

// check verification
exports.check_verification = async (req, res, next) => {
  let userdata = req.body;

  if (
    !userdata.id ||
    !userdata.accountType ||
    !userdata.email ||
    !userdata.authCode
  ) {
    // unprocessable entity
    return res.status(422).send({ message: "invalid data" });
  }

  let session = await mongoose.startSession();
  try {
    await session
      .withTransaction(async () => {
        let doc = await mongoose
          .model(userdata.accountType)
          .findById(userdata.id)
          .lean();

        if (doc) {
          if (doc.auth_code != userdata.authCode) {
            ///  no match found
            return res
              .status(400)
              .send({ message: "incorrect code !!, try again" });
          }

          // set the user as a validated user

          await mongoose
            .model(userdata.accountType)
            .updateOne(
              { _id: doc._id },
              { $set: { validated: true } },
              { session }
            );

          let tokenPayload = {
            _id: doc._id,
            one_signal_id: doc.one_signal_id,
            uuid:doc.uuid,
            firstName: doc.firstName,
            lastName: doc.lastName,
            email: doc.email,
            account_type: doc.account_type,
            notifications_repo: doc.notifications_repo,
          };
          let token = jwt.sign(tokenPayload, secretToken);
          return res.status(200).send({ token, userData: doc });
        } else {
          // not found
          res.status(404).send({ message: "Not Found!!" });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  } finally {
    session.endSession(() =>
      console.log("session of check verification ended")
    );
  }
};
