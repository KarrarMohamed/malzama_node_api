const mongoose = require("mongoose");
const {secretToken} = require('../../../middleware/validation');
var jwt = require("jsonwebtoken");
const {
  generate6DigitsCode,
} = require("../../../middleware/generate_6digit_code");
const { getAllUsersCollection } = require("../../../services/helper_functions");
const { sendAuthCodeViaEmailTo } = require("../../../mailer/index");
exports.setGeneralInfo = async (req, res) => {
  if (req.body.isEmailModified) {
    onEmailModifiedHandler(req, res);
  } else {
    console.log('updating without email changed')
    updateInfoWithTransations(req, res);
  }
};

async function updateInfoWithTransations(req, res) {
  let session = await mongoose.startSession();

  try {
    await session
      .withTransaction(async () => {
        await updatePersonalDocument(req,session);
        await updateAllUsersDocument(req,session);
        let token = await generateNewToken(req);
        res.status(200).send({ token:token });
      })
      .catch((err) => {
        console.log("error inside the catch block of editing general info");
        console.log(err);
        res.status(500).send();
      });
  } finally {
    session.endSession(() =>
      console.log("session of editing general info has been ended")
    );
  }
}

function getUpdatePayload(req) {
  let payload = req.body;
  delete payload["emailModified"];
  console.log('===============================================================');
  console.log('payload');
  console.log(payload);
  console.log('===============================================================');
  return payload;
}
async function onEmailModifiedHandler(req, res) {
  let authCode = generate6DigitsCode();
  try {
    await updateAuthCodeOfPersonalDocument(req, authCode);
    sendAuthCodeViaEmailTo(req.data.firstName, req.body.email, authCode);
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
}
async function updateAuthCodeOfPersonalDocument(req, authCode) {
  await mongoose.model(req.data.account_type).updateOne(
    { _id: req.data._id },
    {
      $set: {
        auth_code: authCode,
      },
    }
  );
}

async function updatePersonalDocument(req, session) {
  let payload = getUpdatePayload(req);
  await mongoose.model(req.data.account_type).updateOne(
    { _id: req.data._id },
    {
      $set: { ...payload },
    },
    { session }
  );
}
async function updateAllUsersDocument(req, session) {
  let payload = getUpdatePayload(req);
  let allUsersCollection = getAllUsersCollection(req.data.account_type);
  await mongoose.model(allUsersCollection).updateOne(
    { _id: req.data._id },
    {
      $set: { ...payload },
    },
    { session }
  );
}

async function generateNewToken(req) {
  let payload = getUpdatePayload(req);

  let tokenPayload = {
    _id: req.data._id,
    one_signal_id: req.data.one_signal_id,
    uuid: req.data.uuid,
    firstName: payload.firstName ? payload.firstName : req.data.firstName,
    lastName: payload.lastName ? payload.lastName : req.data.lastName,
    email: payload.email ? payload.email : req.data.email,
    account_type: req.data.account_type,
    notifications_repo: req.data.notifications_repo,
  };
  let token = jwt.sign(tokenPayload, secretToken);
  return token;
}
