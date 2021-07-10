const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const requiredString = {
    type: String,
    required: true,
  };


const user_unified_attr = {
  firstName: {
    type: String,
    maxlength: 20,
    minLength: 2,
    required: true,
  },
  lastName: {
    type: String,
    maxlength: 20,
    minLength: 2,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: requiredString,
  phoneNumber: {
    type: String,
    minLength: 11,
    maxlength: 11,
    default:null
  },
  gender: String,
  province: String,
  bio:String,             
  account_type: requiredString,
  profile_picture_ref: {
    type:String,
    default:null
  },
  profile_cover_ref: {
    type:String,
    default:null
  },
  profile_picture_link: String,
  cover_picture_link: String,
  one_signal_id:requiredString,
  uuid:requiredString,
  // server side  (related to server internal operations)

  
  auth_code:String,
  active: {
    type: Boolean,
    default: true,
  },
  validated: {
    type: Boolean,
    default: false,
  },
};

// All Users Schema
// const AllUsersSchema = Schema(
//   {
//     email: requiredString,
//     password: requiredString,
//     account_type: requiredString,
//     refId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//     },
//     validated: {
//       type: Boolean,
//       default: false,
//     },
//     auth_code: requiredString,
//     isLoggedIn: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     collection: "all_users",
//   }
// );

// ************************************** School Users *******************************************
// ***********************************************************************************************

// school_teacher_schema
const SchTeacherSchema = Schema(
  {
    ...user_unified_attr,
    subRegion: {
      type: String,
      default: null,
    },
    school_section: requiredString,
    school: requiredString,
    speciality: requiredString, // define the class he or she is teaching like math , chemistry .. et cetera,
    notifications_repo:{
      type:String,
      default:'schteachersNotificationsRepo'
    },
    stages: {
      type: [Number],
      default: [12],
    },

    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "schlectures",
      },
    ],
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "schvideos",
      },
    ],
    quizes: [
      {
        type: Schema.Types.ObjectId,
        ref: "schquizes",
      },
    ],
    saved_lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "schlectures",
      },
    ],
    saved_videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "schvideos",
      },
    ],
    saved_quizes: [
      {
        type: Schema.Types.ObjectId,
        ref: "schquizes",
      },
    ],
    subscribers:[
      {
        id:{
          type:Schema.Types.ObjectId,
          ref:'schstudents'
        },
        one_signal_id:requiredString
      }
    ]
  },
  {
    collection: "schteachers",
  }
);

// school_student_schema
const SchStudentSchema = Schema(
  {
    ...user_unified_attr,
    subRegion: {
      type: String,
      default: null,
    },
    school_section: requiredString,
    school: requiredString,
    notifications_repo:{
      type:String,
      default:'schstudentsNotificationsRepo'
    },
    stage: {
      // this field is for future so dont need any implementation in the front end
      type: Number,
      default: 12,
    },

    saved_lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "schlectures",
      },
    ],
    saved_videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "schvideos",
      },
    ],
    saved_quizes: [
      {
        type: Schema.Types.ObjectId,
        ref: "schquizes",
      },
    ],
  },
  {
    collection: "schstudents",
  }
);

//******************************** University Users ************************************ */
// ********************************************************************************************

// university_teacher
const UniTeacherSchema = Schema(
  {
    ...user_unified_attr,
    university: requiredString,
    college: requiredString,
    section: requiredString,
    speciality: requiredString,
    notifications_repo:{
      type:String,
      default:'uniteachersNotificationsRepo'
    },
    stages: {
      type: [Number],
    },

    saved_lectures: [
      {
        type: Schema.Types.ObjectId, // for normal student and rep student
        ref: "unilectures", // rep student = student who has the
      }, // the previleges to upload videos and lectures as a specific college representative
    ],

    saved_videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "univideos",
      },
    ],
    saved_quizes: [
      {
        type: Schema.Types.ObjectId,
        ref: "uniquizes",
      },
    ],

    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "unilectures",
      },
    ],
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "univideos",
      },
    ],
    quizes: [
      {
        type: Schema.Types.ObjectId,
        ref: "uniquizes",
      },
    ],

  },
  {
    collection: "uniteachers",
  }
);

// university_student_schema
const UniStudentSchema = Schema(
  {
    ...user_unified_attr,
    university: requiredString,
    college: requiredString,

    section: requiredString,
    notifications_repo:{
      type:String,
      default:'unistudentsNotificationsRepo'
    },
    stage: {
      type: Number,
      required: true,
    },

    label:String,
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "unilectures",
      },
    ],
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "univideos",
      },
    ],
    quizes: [
      {
        type: Schema.Types.ObjectId,
        ref: "uniquizes",
      },
    ],
    saved_lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "unilectures",
      },
    ],
    saved_videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "univideos",
      },
    ],
    saved_quizes: [
      {
        type: Schema.Types.ObjectId,
        ref: "uniquizes",
      },
    ],
  },
  {
    collection: "unistudents",
  }
);

module.exports = {
  UniStudentSchema,
  UniTeacherSchema,
  SchStudentSchema,
  SchTeacherSchema,
  //AllUsersSchema
};
