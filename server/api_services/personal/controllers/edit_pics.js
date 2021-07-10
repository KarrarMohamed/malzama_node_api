const mongoose = require("mongoose");
const { getAllUsersCollection } = require("../../../services/helper_functions");

// require fieldName and picUrl as query string
exports.uploadPicture = async (req, res) => {
  if (!req.query.fieldName) {
    return res.status(400).send();
  }
  let session = await mongoose.startSession();

  try {
    await session
      .withTransaction(async () => {
        await _updateThePersonalDocument(req, session);
        await _updateAllUsersDocument(req, session);
        if (req.query.oldUrl) {
          await _updateDeletedFiles(req, session);
        }
        res.status(200).send();
      })
      .catch((err) => {
        onError(req, err);
      });
  } finally {
    session.endSession(() =>
      console.log("session of uploading picture ended successfully")
    );
  }
};

async function _transationWrapper(req, session) {
  await _updateThePersonalDocument(req, session);
  await _updateAllUsersDocument(req, session);
  if (req.query.oldUrl) {
    await _updateDeletedFiles(req, session);
  }
}

function onError(res, err) {
  res.status(500).send({ err });
}

async function _updateThePersonalDocument(req, session) {
  await mongoose.model(req.data.account_type).updateOne(
    { _id: req.data._id },
    {
      $set: {
        [req.query.fieldName]: req.query.picUrl ? req.query.picUrl : null,
      },
    },
    { session }
  );
  console.log("_updateThePersonalDocument done");
}

async function _updateAllUsersDocument(req, session) {
  let allUsersCollection = getAllUsersCollection(req.data.account_type);
  await mongoose.model(allUsersCollection).updateOne(
    { _id: req.data._id },
    {
      $set: {
        [req.query.fieldName]: req.query.picUrl ? req.query.picUrl : null,
      },
    },
    { session }
  );
  console.log("_updateAllUsersDocument done");
}

async function _updateDeletedFiles(req, session) {
  let collection = getAllUsersCollection() + "_files";
  await mongoose.model(collection).updateOne(
    {},
    {
      $push: {
        deleted_files: req.query.oldUrl,
      },
    },
    {
      session,
    }
  );
  console.log("_updateDeletedFiles done");
}
