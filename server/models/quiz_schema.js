const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const requiredString = {
  type: String,
  required: true,
};
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
  topic: requiredString,
  uuid:requiredString
};

const UniversityQuizSchema = new Schema(
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
    author: {
      type:Schema.Types.ObjectId,
      required:true
    },
    questionsCount:Number,
    questions: [
      {
        _id:Schema.Types.ObjectId,
        question: requiredString,
        options: [requiredString],
        answers: [Number],
        explain: {
          type: String,
          default: null,
        },
      },
    ],
  },
  { collection: "uniquizes" }
);

const SchoolQuizSchema = new Schema(
  {
    ...post_unified_attr,
    stage: {
      type: Number,
      required: true,
    },
    school_section: requiredString,

    author: {
      type:Schema.Types.ObjectId,
      required:true
    },
    questions: [
      {
        question: requiredString,
        options: [requiredString],
        answers: [Number],
        explain: {
          type: String,
          default: null,
        },
      },
    ],
  },
  { collection: "schquizes" }
);

module.exports = {
  SchoolQuizSchema,
  UniversityQuizSchema,
};
