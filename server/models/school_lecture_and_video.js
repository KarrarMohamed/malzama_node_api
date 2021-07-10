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

// school lecture schema
const SchLectureSchema = Schema(
  {
    ...post_unified_attr,
    stage: {
      type: Number,
      required: true,
    },
    school_section: requiredString,
    author: Schema.Types.ObjectId,
    size: Number,
    comments_collection: {
      type: String,
      default: "schLecturesComments",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "schLecturesComments",
      },
    ],
    material_collection: {
      type: String,
      default: "schlectures",
    },
    material_type: {
      type: String,
      default: "lecture",
    },
    localPath:{
      type:String,
      required:true
    }
  },
  {
    collection: "schlectures",
  }
);

const SchVideoSchema = Schema(
  {
    ...post_unified_attr,
    stage: {
      type: Number,
      required: true,
    },
    school_section: requiredString,

    author: Schema.Types.ObjectId,
    
    comments_collection: {
      type: String,
      default: "schVideosComments",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "schVideosComments",
      },
    ],
    material_collection: {
      type: String,
      default: "schvideos",
    },
    material_type: {
      type: String,
      default: "video",
    },
  },
  {
    collection: "schvideos",
  }
);

module.exports = {
  SchVideoSchema,
  SchLectureSchema,
};
