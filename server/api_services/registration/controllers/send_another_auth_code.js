var {sendAuthCodeViaEmailTo} = require("../../../mailer/index");
const mongoose = require("mongoose");

//**[send another auth_code] */

exports.send_another_auth_code = async (req, res, next) => {

  if(!req.query.id || !req.query.accountType){
    return res.status(404).send({message:'Invalid data'});
  }
  try {
    let user = await mongoose
      .model(req.query.accountType)
      .findOne({ _id: req.query.id })
      .lean();
    if (user) {
      let email = req.query.email ? req.query.email : user.email
      sendAuthCodeViaEmailTo(user.firstName,email, user.auth_code);
      return res.status(200).send();
    } else {
      // not found
      return res.status(404).send();
    }
  } catch (err) {
    // internal server error
    return res.status(500).send({ message: err });
  }
};
