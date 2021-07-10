const mongoose = require("mongoose");
const {
  generate6DigitsCode,
} = require("../../../middleware/generate_6digit_code");
const { sendAuthCodeViaEmailTo } = require("../../../mailer/index");
// ! require email and accountType as a query string
exports.forgotPasswordHandler = async (req, res) => {
  if (!req.query.email || !req.query.accountType) {
    return res.status(400).send();
  }

  try {
    let user = await mongoose
      .model(req.query.accountType)
      .findOne({ email: req.query.email });
    if (!user) {
      // not found
      return res.status(404).send();
    }

    let authCode = generate6DigitsCode();
    await mongoose.model(req.query.accountType).updateOne(
      { email: req.query.email },
      {
        $set: {
          auth_code: authCode,
        },
      }
    );

    sendAuthCodeViaEmailTo(user.firstName, user.email, authCode);
  } catch (err) {
    return res.status(500).send({ err });
  }
};
