const bcrypt = require("bcryptjs");
var {sendAuthCodeViaEmailTo} = require("../../../mailer/index");
const mongoose = require("mongoose");
const codeValidation = require("../../../middleware/generate_6digit_code");
const {
  checkIsAcademic,
  checkIsTeacher,
} = require("../../../services/helper_functions");

// signup for all users
exports.signup = async (req, res, next) => {
  console.log("********************************** inside signup");

  let userData = req.body;

  console.log(userData);

  const session = await mongoose.startSession();

  try {
    await session
      .withTransaction(async () => {
        let doc = await mongoose
          .model("uniusers")
          .findOne({ email: userData.email }, {}, { session })
          .lean();

        let doc2 = await mongoose
          .model("schusers")
          .findOne({ email: userData.email }, {}, { session })
          .lean();

        if (doc || doc2) {

          console.log('=============================================');
          console.log('already reported');
          console.log('=============================================');
          // 208 === already reported
          return res.status(208).send({
            message: "this email is already in use",
          });
        }
        console.log('=============================================');
        console.log('not reported');
        console.log('=============================================');
        // hash the password
        userData.password = await bcrypt.hash(userData.password, 12);

        // generate authentication code
        let auth_code = codeValidation.generate6DigitsCode();
        userData.auth_code = auth_code;

        // save to mongodb
        let user = await mongoose
          .model(userData.account_type)
          .create([userData], { session });
        console.log(user[0]);

        let allusersDocument = {
          _id: user[0]._id,
          one_signal_id: user[0].one_signal_id,
          uuid: user[0].uuid,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          account_type: user[0].account_type,
          email:user[0].email,
          profile_pic_ref: null,
          profile_cover_ref: null,
          notifications_repo: user[0].notifications_repo,
        };

        let isAcademic = checkIsAcademic(user[0].account_type);

        if (isAcademic) {
          allusersDocument["college"] = req.body.college;
          allusersDocument["university"] = req.body.university;
          allusersDocument["section"] = req.body.section;
        } else {
          allusersDocument["school"] = req.body.school;
          allusersDocument["school_section"] = req.body.school_section;
        }

        if (checkIsTeacher(userData.account_type)) {
          allusersDocument["speciality"] = req.body.speciality;
        }

        await mongoose
          .model(isAcademic ? "uniusers" : "schusers")
          .create([allusersDocument], { session });

        sendAuthCodeViaEmailTo(user[0].firstName, user[0].email, auth_code);

        res.status(201).send({ userData: user[0] });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ err });
      });
  } finally {
    session.endSession(() => console.log("session of registration ended"));
  }
};
