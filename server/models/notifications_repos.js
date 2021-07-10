const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// notification category = [ new_comment , new_reply , new_rate, new_video , new_lecture,new_quiz ]
// target_group = 'universtiy-college-stage'  ex 'baghdad-pharmacy-5'
const requiredString = {
  type: String,
  required: true,
};

const commonNotificationFields = {
  author: Schema.Types.ObjectId,
  text: requiredString,
  post_date: {
    type: Date,
    default: Date.now(),
  },
  category: String,
  comment_id: { type: Schema.Types.ObjectId, default: null },
  material_id: Schema.Types.ObjectId,
  material_collection: String,
  target_audience: {
    user: { id: Schema.Types.ObjectId, one_signal_id: String },
    school_group: [{ id: Schema.Types.ObjectId, one_signal_id: String }],
    college_group: String,
  },
};
// school teachers repo
const SchTeachersNotificationsRepo = new Schema(
  {
    ...commonNotificationFields,
  },
  { collection: "schteachersNotificationsRepo" }
);

// school students repos
const SchstudentsNotificationsRepo = new Schema(
  {
    ...commonNotificationFields,
  },
  { collection: "schstudentsNotificationsRepo" }
);

// school students repos
const UnistudentsNotificationsRepo = new Schema(
  {
    ...commonNotificationFields,
  },
  { collection: "unistudentsNotificationsRepo" }
);

// school students repos
const UniteachersNotificationsRepo = new Schema(
  {
    ...commonNotificationFields,
  },
  { collection: "uniteachersNotificationsRepo" }
);

// upload a new post
// commented on your post  => post id plus all comments
// rate your comment as helpful  => post id plus all comments
// rate your comment as unhelpful  =>

module.exports = {
  UniteachersNotificationsRepo,
  UnistudentsNotificationsRepo,
  SchstudentsNotificationsRepo,
  SchTeachersNotificationsRepo,
};
