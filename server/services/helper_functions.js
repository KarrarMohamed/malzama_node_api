const mongoose = require("mongoose");

exports.checkIsAcademic = (account_type) => {
  let isAcademic =
    account_type == "unistudents" || account_type == "uniteachers";
  return isAcademic;
};

exports.checkIsTeacher = (accountType) => {
  return accountType == "uniteachers" || accountType == "schteachers";
};

exports.getAllUsersCollection = (account_type) => {
  return this.checkIsAcademic(account_type) ? "uniusers" : "schusers";
};

exports.getPaginationIdFactor = (id) => {
  if (!id || id.toString() == 'null') {
    console.log("creating new id factor");
    
    return mongoose.Types.ObjectId();
  }
  console.log('we already have received an id factor');
  return id;
};

exports.getProperUUID = (accountType, uuid) => {
  let isTeacher = this.checkIsTeacher(accountType);
  if (isTeacher) {
    return new RegExp("^" + uuid);
  }
  return uuid;
};
