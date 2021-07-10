const mongoose = require("mongoose");

exports.editBio = async (req, res) => {
  if (!req.query.update) {
    return res.status(400).send();
  }

  try {
    await mongoose.model(req.data.account_type).updateOne(
      { _id: req.data._id },
      {
        $set: {
          bio: req.query.update,
        },
      }
    );
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
};

exports.deleteBio = async (req, res) => {
  try {
    await mongoose.model(req.data.account_type).updateOne(
      { _id: req.data._id },
      {
        $set: {
          bio: null,
        },
      }
    );
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
};
