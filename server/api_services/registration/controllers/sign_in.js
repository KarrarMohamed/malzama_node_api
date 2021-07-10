var jwt = require("jsonwebtoken");
var { secretToken } = require("../../../middleware/validation");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

exports.login = async (req, res, next) => {
  console.log("inside  Login");
  if (!req.body.account_type) {
    return res.status(400).send({ message: "you must specifiy account type" });
  }
  try {
    let doc = await mongoose
      .model(req.body.account_type)
      .findOne({ email: req.body.email })
      .lean();

    if (doc) {
      // compare the mathcing of passwords
      const result = await bcrypt.compare(req.body.password, doc.password);

      // if no match found
      if (!result) {
        console.log("incorrect email or passwrod");
        return res.status(400).send({ incorrect: true });
      }

      // if user has not verified his account yet
      if (!doc.validated) {
        return res.status(400).send({ validated: false, doc });
      }

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
      return res.status(200).send({ token, doc });
    } else {
      // not found
      return res.status(404).send({ message: "Not Found!!" });
    }
  } catch (err) {
    next(err);
  }
};
