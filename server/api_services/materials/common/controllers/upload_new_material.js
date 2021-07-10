const mongoose = require("mongoose");
const e = require("express");
const { da } = require("date-fns/locale");
const {
  sendNotificationViaOneSignal,
} = require("../../../../../onesignal/onesignal_api");

// upload new lecture for uniteacher , unistudent , schteacher
exports.uploadMaterial = async (req, res, next) => {
  let material_collection;
  let newMaterial;

  let materialCommonFields;
  let collegeCommonFields;

  try {
    materialCommonFields = {
      title: req.body.title,
      description: req.body.description,
      topic: req.body.topic,
      stage: parseInt(req.body.stage.toString()),
      author: req.data._id,
      uuid: req.body.uuid,
    };

    if (req.body.upload_type == "lectures") {
      materialCommonFields["localPath"] = req.body.local_path;
      materialCommonFields["size"] = req.body.size;
    }

    let materialValues = Object.values(materialCommonFields);
    for (let value of materialValues) {
      if (value == "" || value == null) {
        throw new Error("error in common material fields");
      }
    }

    if (req.data.account_type != "schteachers") {
      collegeCommonFields = {
        university: req.body.university,
        college: req.body.college,
        section: req.body.section, // in case of dental college => it will be unknown
      };

      let collegeValues = Object.values(collegeCommonFields);

      for (let value of collegeValues) {
        if (value == "" || value == null) {
          throw new Error("error in college fields");
        }
      }
      collegeCommonFields["semester"] = req.body.semester || null;
    }

    if (!req.body.upload_type) {
      throw new Error("upload type not is null");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: materialCommonFields });
  }

  if (req.body.upload_type != "quizes") {
    materialCommonFields["src"] = req.body.src;
  }

  switch (req.body.upload_type) {
    case "lectures":
      if (req.data.account_type == "schteachers") {
        newMaterial = {
          ...materialCommonFields,
          school_section: req.body.school_section,
        };

        material_collection = "schlectures";
      } else {
        newMaterial = {
          ...materialCommonFields,
          ...collegeCommonFields,
        };

        material_collection = "unilectures";
      }

      break;

    case "videos":
      {
        if (req.data.account_type == "schteachers") {
          newMaterial = {
            ...materialCommonFields,
            school_section: req.body.school_section,
          };

          material_collection = "schvideos";
        } else {
          newMaterial = {
            ...materialCommonFields,
            ...collegeCommonFields,
          };

          material_collection = "univideos";
        }
      }
      break;

    case "quizes":
      let _questions = [];
     // console.log(req.body.questions);
      
      for (let entity of req.body.questions) {
        
        let quizEntity = entity;
        quizEntity["_id"] = mongoose.Types.ObjectId();
        _questions.push(quizEntity);
      }

      console.log(_questions);
      
      materialCommonFields["questions"] = _questions;
      materialCommonFields["questionsCount"] = _questions.length;
      if (req.body.account_type == "schteachers") {
        newMaterial = {
          ...materialCommonFields,
          school_section: req.body.school_section,
        };
        material_collection = "schquizes";
      } else {
        newMaterial = {
          ...materialCommonFields,
          ...collegeCommonFields,
        };
        material_collection = "uniquizes";
      }
      break;
    default:
      return res.status(400).send("invalid upload data from default");
  }

  const session = await mongoose.startSession();

  try {
    await session
      .withTransaction(async () => {
        // save the material in the DB
        let newLecture = await mongoose
          .model(material_collection)
          .create([newMaterial], { session: session });
        console.log("after saving");
        console.log("========================================================");
        console.log(newLecture);
        console.log("=======================================================");

        let upload_type = req.body.upload_type.toString();

        // update a reference to the new lecture in the uploader document
        await mongoose.model(req.data.account_type).findByIdAndUpdate(
          req.data._id,
          {
            $push: {
              [upload_type]: newLecture[0]._id,
            },
          },
          { session: session, useFindAndModify: false }
        );

        // send notificaiton to followers
        sendNotificationToFollowers(
          req,
          material_collection,
          newLecture[0]._id
        );

        newLecture = newLecture[0];
        if (upload_type == "quizes") {
          newLecture = {
            post_date: newLecture.post_date,
            _id: newLecture._id,
            ids_list: newLecture.questions.map((item) => item._id),
          };
        }
        res.status(201).send({ data: newLecture });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ err });
      });
  } finally {
    session.endSession(() =>
      console.log("session of uploading new lecture has been ended")
    );
    return;
  }
};

// *******************************************************************************************************
//                                                                                                       *
//                   send Notification to followers upon uploading a new material                        *
//                                                                                                       *
// *******************************************************************************************************
async function sendNotificationToFollowers(
  req,
  material_collection,
  material_id
) {
  let { target_college, target_university, target_stage } = req.body;
  let targetIdsToNotify;
  let school_group;

  // specify the target ids to notify
  if (req.data.account_type == "schteachers") {
    let data = await mongoose
      .model(req.data.account_type)
      .findOne({ _id: req.data._id }, { _id: 0, subscribers: 1 });
    if (data.length != 0) {
      targetIdsToNotify = data.subscribers.map((item) => item.one_signal_id);
      school_group = data.subscribers.map((item) => item._id);
    } else targetIdsToNotify = data;
  } else {
    let data = await mongoose.model("unistudents").find(
      {
        college: target_college,
        university: target_university,
        stage: target_stage,
      },
      { one_signal_id: 1, _id: 0 }
    );

    if (data.length != 0) targetIdsToNotify = data.map((d) => d.one_signal_id);
    else targetIdsToNotify = [];
  }

  if (targetIdsToNotify.length == 0) {
    return;
  }

  // specify the upload type like lecture or video or quiz
  let uploadType = req.body.upload_type;
  uploadType = uploadType.spit("");
  uploadType.pop();
  uploadType = uploadType.join("");

  // set the text of the notification
  let description = `${
    req.data.firstName + " " + req.data.lastName
  } uploaded a new ${uploadType}: ${req.body.title}`;

  let target_audience = {
    user: null,
    school_group: null,
    college_group: null,
  };

  // set the target audience
  if (req.data.account_type == "schteachers") {
    target_audience.school_group = school_group;
  } else {
    target_audience.college_group = `${target_university}-${target_college}-${target_stage}`;
  }

  let newNotification = {
    text: description,
    category: `new_${uploadType}`,
    material_id: material_id,
    material_collection: material_collection,
    target_audience,
  };

  await mongoose
    .model("unistudentsNotificationsRepo")
    .create([newNotification]);
  let notificationMessage = {
    app_id: "50c8ad6e-b20b-4f8e-a71a-219c4f4ce74e",
    contents: { en: description },
    headings: { en: "وظيفة مبرمج" },
    subtitle: { en: "" },
    include_player_ids: targetIdsToNotify,
  };

  sendNotificationViaOneSignal(notificationMessage);
}
