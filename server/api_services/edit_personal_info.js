const mongoose = require("mongoose");
const codeGenerator = require("../middleware/generate_6digit_code");
const mailer = require("../mailer");

exports.edit_personal_info = async (req, res, next) => {
  let session = await mongoose.startSession();
  try {
    await session
      .withTransaction(async () => {
        let { firstName, lastName, email } = req.body;
        if (!firstName || !lastName || !email) {
          return res.status(422).send({ message: "unprocessable data" });
        }

        let dataToUpdate = { firstName, lastName, email };
        let auth_code;

        // check if the email is also to be updated
        // so we generate a new auth_code for verification
        if (req.data.email != email) {
          auth_code = codeGenerator.generate6DigitsCode();
          dataToUpdate["auth_code"] = auth_code;
        }

        // update the new data
        await mongoose.model(req.data.account_type).updateOne(
          { _id: req.data._id },
          {
            $set: { ...dataToUpdate },
          },
          { session }
        );

        let isAcademic =
          req.data.account_type == "unistudents" ||
          req.data.account_type == "uniteachers";

        await mongoose.model(isAcademic ? "uniusers" : "schusers").updateOne(
          { _id: req.data._id },
          {
            $set: { ...dataToUpdate },
          },
          { session }
        );

        // if the auth code is setted , send a verification auth_code via mailer
        // to the new email setted by the user
        if (auth_code) {
          mailer(dataToUpdate.firstName, dataToUpdate.email, auth_code);
          res
            .status(200)
            .send({ message: "done,please verifiy your new email" });
        } else {
          res.status(200).send({ message: "done" });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  } finally {
    session.endSession(() =>
      console.log("session of the edit personal info ended")
    );
  }
};
