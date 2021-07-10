const mongoose = require("mongoose");
const {
  getPaginationIdFactor,
  getAllUsersCollection,
  getProperUUID,
} = require("../../../../services/helper_functions");

// ! require [idFactor,collectionName,uuid] as query string
// * idFactor is used for pagination to select and sort the returned value
// * if idFactor is not availabe , it should be sent as null
exports.fetchMaterials = async (req, res, next) => {
  // * we here check only for collection name
  // * because idFactor at the first pagination fetch is always null;
  if (!req.query.collectionName) {
    return res.status(400).send();
  }
  
  let idFactor = getPaginationIdFactor(req.query.idFactor);
  let uuid_matcher = getProperUUID(req.data.account_type, req.data.uuid);

  try {
    let data = await mongoose
      .model(req.query.collectionName)
      .find({ _id: { $lt: idFactor }, uuid: uuid_matcher })
      .populate("author", "", getAllUsersCollection(req.data.account_type))
      .sort("-_id")
      .limit(10)
      .lean();

      console.log(req.query.idFactor);
    res.status(200).send({data});
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
};

function isTeacher(accountType) {
  return accountType == "uniteachers" || accountType == "schteachers";
}
