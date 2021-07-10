const mongoose = require("mongoose");
require("dotenv").config();
const {
  UniStudentSchema,
  UniTeacherSchema,
  SchStudentSchema,
  SchTeacherSchema,
} = require("./users");

// univeristy videos and lectures schema
const {
  UniVideoSchema,
  UniLectureSchema,
} = require("./university_lecture_and_video");

// school videos and lectures schema
const {
  SchVideoSchema,
  SchLectureSchema,
} = require("./school_lecture_and_video");

// university and school quizes
const { SchoolQuizSchema, UniversityQuizSchema } = require("./quiz_schema");

// school comments on videos and lectures
const {
  SchoolVideoCommentSchema,
  SchoolLectureCommentSchema,
} = require("./school_comments");

// university comments on videos and lectures
const {
  UniversityVideoCommentSchema,
  UniversityLectureCommentSchema,
} = require("./university_comments");

// notifications repos

const {
  UniteachersNotificationsRepo,
  UnistudentsNotificationsRepo,
  SchstudentsNotificationsRepo,
  SchTeachersNotificationsRepo,
} = require("./notifications_repos");

const { uniuser, schuser } = require("./uni_users");
const {schoolDeletedFilesSchema,collegeDeletedFilesSchema} = require('./deleted_files');

// mongodb://localhost:30003,localhost:30002,localhost:30001/myapp
// mongodb+srv://<username>:<password>@usta-debug-db-qizyc.mongodb.net/test?retryWrites=true&w=majority
// 'mongodb://localhost:27017/myapp'
// const {
//     MONGO_USERNAME,
//     MONGO_PASSWORD,
//     MONGO_HOSTNAME,
//     MONGO_PORT,
//     MONGO_DB,
//     MONGO_REPLICASET
// } = process.env;

const requiredString = {
  type: String,
  required: true,
};

// list of all registered users of all account types including just their emails

//mongodb+srv://<username>:<password>@usta-debug-db-qizyc.mongodb.net/test?retryWrites=true&w=majority

// all users
//const AllUsers = mongoose.model("all_users", AllUsersSchema);

// for account types
const UniTeacher = mongoose.model("uniteachers", UniTeacherSchema);
const SchTeacher = mongoose.model("schteachers", SchTeacherSchema);
const UniStudent = mongoose.model("unistudents", UniStudentSchema);
const SchStudent = mongoose.model("schstudents", SchStudentSchema);

const UniUsers = mongoose.model("uniusers", uniuser);
const SchUsers = mongoose.model("schusers", schuser);

// for material types

// for universities ...
const UniLect = mongoose.model("unilectures", UniLectureSchema);
const UniVideo = mongoose.model("univideos", UniVideoSchema);
const UniQuiz = mongoose.model("uniquizes", UniversityQuizSchema);

// for schools
const SchLect = mongoose.model("schlectures", SchLectureSchema);
const SchVideo = mongoose.model("schvideos", SchVideoSchema);
const SchQuiz = mongoose.model("schquizes", SchoolQuizSchema);

// ==========================================

/// for comments

// for universities
const UniLectComment = mongoose.model(
  "uniLecturesComments",
  UniversityLectureCommentSchema
);
const UniVideoComment = mongoose.model(
  "uniVideosComments",
  UniversityVideoCommentSchema
);

// for schools
const SchLectComment = mongoose.model(
  "schLecturesComments",
  SchoolLectureCommentSchema
);
const SchVideoComment = mongoose.model(
  "schVideosComments",
  SchoolVideoCommentSchema
);

// ==========================================

// for Notifications

// for universities
const UniStudentsNotRepo = mongoose.model(
  "unistudentsNotificationsRepo",
  UnistudentsNotificationsRepo
);
const UniTeachersNotRepo = mongoose.model(
  "uniteachersNotificationsRepo",
  UniteachersNotificationsRepo
);

// for schools
const SchStudentsNotRepo = mongoose.model(
  "schstudentsNotificationsRepo",
  SchstudentsNotificationsRepo
);
const SchTeachersNotRepo = mongoose.model(
  "schteachersNotificationsRepo",
  SchTeachersNotificationsRepo
);


// deleted files
const collegeDeletedFiles = mongoose.model('uniusers_files',collegeDeletedFilesSchema);
const schoolDeletedFiles = mongoose.model('schusers_files',schoolDeletedFilesSchema);


// deleted files
// ============================================================================
// ============================================================================
// mongoose connection configurations
const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true,
  // authSource:'admin',
  // replicaSet:'mongo_transaction',
  // dbName:'malzama_platform'
};

/// [these methods will be called once the server start running]

/// the reason for calling these methods  is that
/// our mongodb database will be deployed as replica set
/// and mongodb multi_document_transaction_api does not create any collection when they does not exist
/// so we call these methods to make sure that all collections are created and found inside the database
/// so the trnasaction api will not throw any error regarding this ;

async function createCollegeDeletedFiles(){
  let docs = await collegeDeletedFiles.find({});
  if(docs.length == 0){
    await collegeDeletedFiles.create([
      {
        deleted_files:['somefile']
      }
    ]);
    await collegeDeletedFiles.deleteOne({});
    console.log('college deleted files done');
  }else{
    console.log('college deleted files done');
  }
}

async function createSchoolDeletedFiles(){
  let docs = await schoolDeletedFiles.find({});
  if(docs.length == 0){
    await schoolDeletedFiles.create([
      {
        deleted_files:['somefile']
      }
    ]);
    await schoolDeletedFiles.deleteOne({});
    console.log('school deleted files done');
  }else{
    console.log('school deleted files done');
  }
}
async function createSchoolLectCollection() {
  let docs = await SchLect.find({});
  if (docs.length == 0) {
    await SchLect.create([
      {
        title: "Hello",
        description: "Hello",
        topic: "hello",
        stage: 1,
        school_section: "hello",
        author: mongoose.Types.ObjectId(),
        uuid: "uuid",
        localPath: "local path",
      },
    ]);
    console.log("document created");
    await SchLect.deleteOne({});
    console.log("document deleted");
    console.log("createSchoolLectCollection Done");
  }
}
async function createSchoolVideoCollection() {
  let docs = await SchVideo.find({});
  if (docs.length == 0) {
    await SchVideo.create([
      {
        title: "Hello",
        description: "Hello",
        topic: "hello",
        stage: 1,
        school_section: "hello",
        videoId: "hello",
        author: mongoose.Types.ObjectId(),
        uuid: "uuid",
      },
    ]);
    console.log("document created");
    await SchVideo.deleteOne({});
    console.log("document deleted");
    console.log("createSchoolVideoCollection Done");
  }
}

async function createSchoolQuizCollection() {
  let docs = await SchQuiz.find({});
  if (docs.length == 0) {
    await SchQuiz.create([
      {
        title: "Hello",
        description: "Hello",
        topic: "hello",
        stage: 1,
        school_section: "hello",
        author: new mongoose.Types.ObjectId(),
        uuid: "uuid",
        questions: [
          {
            question: "what is your name",
            options: ["karrar", "sajad"],
            answers: [0],
          },
        ],
      },
    ]);
    console.log("document created");
    await SchQuiz.deleteOne({});
    console.log("document deleted");
    console.log("createSchoolQuizCollection Done");
  }
}

async function createSchoolLectCommentCollection() {
  let docs = await SchLectComment.find({});
  if (docs.length == 0) {
    await SchLectComment.create([
      {
        author: mongoose.Types.ObjectId(),
        content: "Hello",
      },
    ]);
    console.log("document created");
    await SchLectComment.deleteOne({});
    console.log("document deleted");
    console.log("createSchoolLectCommentCollection Done");
  }
}

async function createSchoolVideoCommentCollection() {
  let docs = await SchVideoComment.find({});
  if (docs.length == 0) {
    await SchVideoComment.create([
      {
        author: mongoose.Types.ObjectId(),
        content: "Hello",
      },
    ]);
    console.log("document created");
    await SchVideoComment.deleteOne({});
    console.log("document deleted");
    console.log("createSchoolVideoCommentCollection Done");
  }
}
async function createUniVideoCollection() {
  try {
    let docs = await UniVideo.find({});
    if (docs.length == 0) {
      await UniVideo.create([
        {
          title: "Hello",
          description: "Hello",
          topic: "hello",
          stage: 1,
          university: "hello",
          college: "hello",
          videoId: "hello",
          section: "hello",
          uuid: "uuid",
          author: mongoose.Types.ObjectId(),
        },
      ]);
      console.log("document created");
      await UniVideo.deleteOne({});
      console.log("document deleted");
      console.log("createUniVideoCollection Done");
    }
  } catch (err) {
    console.log("error inside create uni video collection");
    console.log(err);
  }
}
async function createUniLectCollection() {
  let docs = await UniLect.find({});
  if (docs.length == 0) {
    await UniLect.create([
      {
        title: "Hello",
        description: "Hello",
        topic: "hello",
        stage: 1,
        university: "hello",
        college: "hello",
        section: "hello",
        uuid: "uuid",
        author: mongoose.Types.ObjectId(),
        localPath: "local path",
      },
    ]);
    console.log("document created");
    await UniLect.deleteOne({});
    console.log("document deleted");
    console.log("createUniLectCollection Done");
  }
}

async function createUniQuizCollection() {
  let docs = await UniQuiz.find({});
  if (docs.length == 0) {
    await UniQuiz.create([
      {
        title: "Hello",
        description: "Hello",
        topic: "hello",
        stage: 1,
        university: "hello",
        college: "hello",
        section: "hello",
        author: new mongoose.Types.ObjectId(),
        uuid: "uuid",
        questions: [
          {
            question: "what is your name",
            options: ["karrar", "sajad"],
            answers: [0],
          },
        ],
      },
    ]);
    console.log("document created");
    await UniQuiz.deleteOne({});
    console.log("document deleted");
    console.log("createUniQuizCollection Done");
  }
}

async function createUniVideoCommentCollection() {
  let docs = await UniVideoComment.find({});
  if (docs.length == 0) {
    await UniVideoComment.create([
      {
        author: mongoose.Types.ObjectId(),
        content: "Hello",
      },
    ]);
    console.log("document created");
    await UniVideoComment.deleteOne({});
    console.log("document deleted");
    console.log("createUniVideoCommentCollection Done");
  }
}

async function createUniLectCommentCollection() {
  let docs = await UniLectComment.find({});
  if (docs.length == 0) {
    await UniLectComment.create([
      {
        author: mongoose.Types.ObjectId(),
        content: "Hello",
      },
    ]);
    console.log("document created");
    await UniLectComment.deleteOne({});
    console.log("document deleted");
    console.log("createUniLectCommentCollection Done");
  }
}

async function createUniStudentsNotificationRepo() {
  let docs = await UniStudentsNotRepo.find({});
  if (docs.length == 0) {
    await UniStudentsNotRepo.create([
      {
        text: "Hello",
      },
    ]);
    console.log("document created");
    await UniStudentsNotRepo.deleteOne({});
    console.log("document deleted");
    console.log("createUniStudentsNotificationRepo Done");
  }
}

async function createUniTeachersNotificationRepo() {
  let docs = await UniTeachersNotRepo.find({});
  if (docs.length == 0) {
    await UniTeachersNotRepo.create([
      {
        text: "Hello",
      },
    ]);
    console.log("document created");
    await UniTeachersNotRepo.deleteOne({});
    console.log("document deleted");
    console.log("createUniTeachersNotificationRepo Done");
  }
}

async function createSchTeachersNotificationRepo() {
  let docs = await SchTeachersNotRepo.find({});
  if (docs.length == 0) {
    await SchTeachersNotRepo.create([
      {
        text: "Hello",
      },
    ]);
    console.log("document created");
    await SchTeachersNotRepo.deleteOne({});
    console.log("document deleted");
    console.log("createSchTeachersNotificationRepo Done");
  }
}

async function createSchStudentsNotificationRepo() {
  let docs = await SchStudentsNotRepo.find({});
  if (docs.length == 0) {
    await SchStudentsNotRepo.create([
      {
        text: "Hello",
      },
    ]);
    console.log("document created");
    await SchStudentsNotRepo.deleteOne({});
    console.log("document deleted");
    console.log("createSchStudentsNotificationRepo Done");
  }
}

async function createAllUsers() {
  try {
    let docs = await UniUsers.find({});
    if (docs.length == 0) {
      await UniUsers.create([
        {
          firstName: "Hello",
        },
      ]);
      console.log("document created");
      await UniUsers.deleteOne({});
    }
  } catch (err) {
    console.log(err.message);
    throw err;
  }

  try {
    docs = await SchUsers.find({});
    if (docs.length == 0) {
      await SchUsers.create([
        {
          firstName: "Hello",
        },
      ]);
      console.log("document created");
      await SchUsers.deleteOne({});
    }
  } catch (err) {
    console.log(err);
  }
  console.log("all users created");
}

// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?replicaSet=${MONGO_REPLICASET}&authSource=admin`;
const url =
  process.env.MONGO_URL || "mongodb://localhost:27017/malzama_platform";
const replica_set_url =
  "mongodb://karrar:karrar@localhost:25001,localhost:25002,localhost:25003";
const mongo_atlas_cloud_url =
  "mongodb+srv://karrar:karrar@malzama-cluster-ggbbo.mongodb.net/malzama_platform?retryWrites=true&w=majority";

  let Schema = mongoose.Schema;
  let schema =  Schema({},{collection:'something'});
  mongoose.model('something',schema);
mongoose
  .connect(mongo_atlas_cloud_url, options)
  .then(async function () {
    // await AllUsers.create([{email:'root',password:'root',accountType:'root',refId:new mongoose.Types.ObjectId()}])
    //await AllUsers.deleteMany({});
    console.log("MongoDB is connected");
    console.log("preparing server ......");
    console.log("please wait .......");
    // schools
    await createSchoolLectCollection();
    console.log('createSchoolLectCollection ... done');
    await createSchoolVideoCollection();
    console.log('createSchoolVideoCollection ... finished');
    await createSchoolLectCommentCollection();
    console.log('createSchoolLectCommentCollection ... finished');
    await createSchoolVideoCommentCollection();
    console.log('createSchoolVideoCommentCollection ... finished');
    await createSchoolQuizCollection();
    console.log('createSchoolQuizCollection ... finished');
    await createSchStudentsNotificationRepo();
    console.log('createSchStudentsNotificationRepo ... finished');
    await createSchTeachersNotificationRepo();
    console.log('createSchTeachersNotificationRepo ... finished');

    // universities
    await createUniVideoCollection();
    console.log('createUniVideoCollection ... finished');
    await createUniLectCollection();
    console.log('createUniLectCollection ... finished');
    await createUniQuizCollection();
    console.log('createUniQuizCollection ... finished');
    await createUniLectCommentCollection();
    console.log('createUniLectCommentCollection ... finished');
    await createUniVideoCommentCollection();
    console.log('createUniVideoCommentCollection ... finished');
    await createUniStudentsNotificationRepo();
    console.log('createUniStudentsNotificationRepo ... finished');
    await createUniTeachersNotificationRepo();
    console.log('createUniTeachersNotificationRepo ... finished');

    await createAllUsers();

    await createCollegeDeletedFiles();
    await createSchoolDeletedFiles();
    console.log('deleted files for both college and school have been completed');
    console.log('createAllUsers ... finished');
    console.log("Done :)\n.\n.\n.\n.");
    console.log("Server is running  ...... ");


    
  })
  .catch(function (err) {
    console.log(err.message);
  });

// let medications = new mongoose.Schema({});
// mongoose.model('medications',medications);

// mongoose.connect("mongodb://localhost:27017/drugs",{useNewUrlParser:true,useUnifiedTopology:true}, (err) => {
//   if (err) throw err;
//   console.log("connected to mongodb localhost");
// });

module.exports = {
  // Universities

  // Uni users
  UniTeacher,
  UniStudent,

  // Uni Materials
  UniLect,
  UniVideo,
  UniQuiz,

  // Uni Comments
  UniLectComment,
  UniVideoComment,

  // Uni Notifications Repos
  UniStudentsNotRepo,
  UniTeachersNotRepo,

  // Schools

  // Sch users
  SchStudent,
  SchTeacher,

  // School materials
  SchLect,
  SchVideo,
  SchQuiz,

  // Sch Comments

  SchLectComment,
  SchVideoComment,

  // Sch Notifications

  SchStudentsNotRepo,
  SchTeachersNotRepo,

  UniUsers,
  SchUsers,
};
