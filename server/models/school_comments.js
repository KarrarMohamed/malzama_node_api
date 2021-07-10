const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requiredString = {
  type: String,
  required: true,
};



const SchoolLectureCommentSchema = new Schema(
  {
    author: Schema.Types.ObjectId,
    content: requiredString,
    post_date: {
      type: Date,
      default: Date.now(),
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "schlectures",
    },
    collection_name: {
      type:String,
      default:"schLecturesComments"
    },

    ratings: [
      {
        _id:Schema.Types.ObjectId,
        rating_author: Schema.Types.ObjectId,
        rating_type: Boolean,
      },
    ],
    replies: [
      {
        _id:Schema.Types.ObjectId,
        reply_author: Schema.Types.ObjectId,
        content: String,
        post_date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    collection: "schLecturesComments",
  }
);

const SchoolVideoCommentSchema = new Schema(
  {
    author: Schema.Types.ObjectId,
    content: requiredString,
    post_date: {
      type: Date,
      default: Date.now(),
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "schvideos",
    },
    collection_name: {
      type:String,
      default:"schVideosComments"
    },

    ratings: [
      {
        _id:Schema.Types.ObjectId,
        rating_author: Schema.Types.ObjectId,
        rating_type: Boolean,
      },
    ],
    replies: [
      {
        _id:Schema.Types.ObjectId,
        reply_author: Schema.Types.ObjectId,
        content: String,
        post_date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    collection: "schVideosComments",
  }
);

module.exports = {
  SchoolVideoCommentSchema,
  SchoolLectureCommentSchema,
};
