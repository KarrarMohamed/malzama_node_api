const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requiredString = {
  type: String,
  required: true,
};
const CommentAutor = {
  id: Schema.Types.ObjectId,
  collection_name: requiredString,
  one_signal_id: requiredString,
  notifications_repo: String,
  profile_pic_ref: String,
  firstName: String,
  lastName: String,
};

const UniversityLectureCommentSchema = new Schema(
  {
    author: Schema.Types.ObjectId,
    content: requiredString,
    post_date: {
      type: Date,
      default: Date.now(),
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "unilectures",
    },
    collection_name: {
      type: String,
      default: "uniLecturesComments",
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
    collection: "uniLecturesComments",
  }
);

const UniversityVideoCommentSchema = new Schema(
  {
    author: Schema.Types.ObjectId,
    content: requiredString,
    post_date: {
      type: Date,
      default: Date.now(),
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "univideos",
    },

    collection_name: {
      type: String,
      default: "uniVideosComments",
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
    collection: "uniVideosComments",
  }
);

module.exports = {
  UniversityVideoCommentSchema,
  UniversityLectureCommentSchema,
};
