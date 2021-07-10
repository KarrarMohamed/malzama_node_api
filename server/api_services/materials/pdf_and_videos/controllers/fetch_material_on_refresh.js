const mongoose = require("mongoose");
const {
  getPaginationIdFactor,
  getAllUsersCollection,
  getProperUUID,
} = require("../../../../services/helper_functions");

// ! require [idFactor,collection] as query string
// * idFactor is used for pagination to select and sort the returned value
// * if idFactor is not availabe , it should be sent as null
exports.fetchMaterialsOnRefresh = async (req, res, next) => {

  if (!req.query.collection || !req.query.idFactor) {
    
    return res.status(400).send();
  }

  
  let uuid_matcher = getProperUUID(req.data.account_type, req.data.uuid);

  try {
    let data = await mongoose
      .model(req.query.collection)
      .find({ _id: { $gt: req.query.idFactor }, uuid: uuid_matcher })
      .populate("author", "", getAllUsersCollection(req.data.account_type))
      .sort("_id")
      .limit(10)
      .lean();

    console.log("==============================");
    console.log(data);
    console.log("===============================");

    res.status(200).send({data});
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
};

function isTeacher(accountType) {
  return accountType == "uniteachers" || accountType == "schteachers";
}
