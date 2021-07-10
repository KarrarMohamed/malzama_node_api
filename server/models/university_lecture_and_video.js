const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requiredString = {
  type: String,
  required: true,
};

// Unified Attributes
const post_unified_attr = {
  title: requiredString,
  post_date: {
    type: Date,
    default: Date.now(),
  },
  last_update: {
    type: Date,
    default: null,
  },
  description: requiredString,
  src: {
    type: String,
  },
  path: {
    type: String,
  },
  topic: requiredString,
  uuid: requiredString,
};

// university_lectures_schema
const UniLectureSchema = Schema(
  {
    ...post_unified_attr,
    university: requiredString,
    college: requiredString,
    section: requiredString,

    stage: {
      type: Number,
      required: true,
    },
    semester: {
      // for pharmacy and medicine colleges
      type: Number,
      default: null,
    },
    author: Schema.Types.ObjectId,
    size: Number,
    localPath:{
      type:String,
      required:true
    },
    comments_collection: {
      type: String,
      default: "uniLecturesComments",
    }, // size of the lecture file
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "uniLecturesComments",
      },
    ],
    material_collection: {
      type: String,
      default: "unilectures",
    },
    material_type: {
      type: String,
      default: "lecture",
    },
  },
  {
    collection: "unilectures",
  }
);

// University_videos_schema
const UniVideoSchema = Schema(
  {
    ...post_unified_attr,
    university: requiredString,
    college: requiredString,
    stage: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      default: null,
    },
    section: requiredString,
    author: Schema.Types.ObjectId,



    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "uniVideosComments",
      },
    ],
    comments_collection: {
      type: String,
      default: "uniVideosComments",
    },
    material_collection: { type: String, default: "univideos" },
    material_type: {
      type: String,
      default: "video",
    },
  },
  {
    collection: "univideos",
  }
);

module.exports = {
  UniVideoSchema,
  UniLectureSchema,
};
