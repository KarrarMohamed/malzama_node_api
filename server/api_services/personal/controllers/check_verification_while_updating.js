const mongoose = require("mongoose");
const { setGeneralInfo } = require("./set_general_info");

exports.verifyAndUpdateInfo = async (req, res) => {
  try {
    let user = await mongoose
      .model(req.data.account_type)
      .findOne({ _id: req.data._id });
    if (!user) {
      return res.status(404).send();
    }

    if (user.auth_code != req.body.authCode) {
      return res.status(400).send({ message: "incorrect auth code" });
    } else {
      setGeneralInfo(req, res);
    }
  } catch (err) {
    return res.status(500).send();
  }
};
