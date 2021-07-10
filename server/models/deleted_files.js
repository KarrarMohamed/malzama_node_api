const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const collegeDeletedFilesSchema = new Schema(
  {
    deleted_files: [String],
  },
  { collection: "uniusers_files" }
);

const schoolDeletedFilesSchema = new Schema(
  {
    deleted_files: [String],
  },
  { collection: "schusers_files" }
);

module.exports = { collegeDeletedFilesSchema, schoolDeletedFilesSchema };
