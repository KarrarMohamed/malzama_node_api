const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let _commonFields = {
  profile_picture_ref: {
    type:String,
    default:null
  },
  profile_cover_ref: {
    type:String,
    default:null
  },
  notifications_repo: String,
  one_signal_id: String,
  firstName: String,
  lastName: String,
  email: String,
  account_type: String,
  uuid: String,
  speciality: {
    type:String,
    default:null,
  },
};

let uniuser = new Schema(
  {
    ..._commonFields,
    college: String,
    university: String,
    section: String,
  },
  { collection: "uniusers" }
);

let schuser = new Schema(
  {
    ..._commonFields,
    school: String,
    schoolSection:String,
  },
  { collection: "schusers" }
);

module.exports = { uniuser, schuser };
