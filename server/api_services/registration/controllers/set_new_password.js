const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// this is a post req cause it carry a critical credentials
exports.setNewPassword = async (req, res) => {
  let hashedPassword = bcrypt.hash(req.body.password, 12);

  try {
    await mongoose.model(req.body.accountType).updateOne(
      { email: req.body.email },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
};
