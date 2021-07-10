const express = require("express");

let n = 0;
const mongoose = require("mongoose");
const {
  UniLect,
  UniTeacher,
  UniVideo,
  UniStudent,
  SchLect,
  SchTeacher,
  SchVideo,
  SchStudent,
  SchQuiz,
  UniQuiz,
  UniLectComment,
  UniVideoComment,
  SchLectComment,
  SchVideoComment,
  UniUsers,
  SchUsers,
} = require("../models/index");
const { getAllUsersCollection } = require("../services/helper_functions");

var router = express.Router();

router.get("/fuck-off", async (req, res, next) => {
  try {
    await UniLect.deleteMany({});
    await UniVideo.deleteMany({});
    await UniTeacher.deleteMany({});
    await UniStudent.deleteMany({});
    await SchLect.deleteMany({});
    await SchTeacher.deleteMany({});
    await SchVideo.deleteMany({});
    await SchStudent.deleteMany({});
    await SchQuiz.deleteMany({});
    await UniQuiz.deleteMany({});
    await UniLectComment.deleteMany({});
    await UniVideoComment.deleteMany({});
    await SchLectComment.deleteMany({});
    await SchVideoComment.deleteMany({});
    await UniUsers.deleteMany();
    await SchUsers.deleteMany();

    return res.status(200).send({ message: "All data deleted successfully" });
  } catch (err) {
    return res.status(500).send({ err });
  }
});

router.get("/read-data/:id/:accountType", async (req, res, next) => {
  try {
    let data = await mongoose
      .model(req.params.id)
      .find({})
      .populate("author", "", getAllUsersCollection(req.params.accountType));

    return res.status(200).send({ [req.params.id]: data });
  } catch (err) {
    next(err);
  }
});

router.get("/fetch-data/:id", async (req, res, next) => {
  let requestArriaval = new Date(Date.now());

  n += 1;
  console.log(
    `request number ------------------ ${n} ----------------- recieved ---- ${n}`
  );
  try {
    let data = await mongoose.model(req.params.id).find({});
    let reqDeparture = new Date(Date.now());
    console.log(`request arriaval: ${requestArriaval}`);
    console.log(`request departure: ${reqDeparture}`);
    console.log(`service dur : ${reqDeparture-requestArriaval}`);
    return res.status(200).send({ [req.params.id]: data });
  } catch (err) {
    next(err);
  }
});

router.get("/delete-data/:id", async (req, res) => {
  try {
    let data = await mongoose.model(req.params.id).deleteMany({});
    return res.status(200).send({
      message: req.params.id.toString() + " Data deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});

router.get("/updateCollection/:collection", async (req, res, next) => {
  let data = await mongoose.model(req.params.collection).updateMany(
    {},
    {
      $set: {
        questionsCount: { $size: "$questions" },
      },
    }
  );
  return res.status(200).send({ message: data });
});

router.get("/deleteCollection/:collection", async (req, res, next) => {
  let data = await mongoose.model(req.params.collection).deleteMany();
  return res.status(200).send({ message: "deleted" });
});

router.post("/post-something", async (req, res) => {
  console.log("new data");
  console.log(req.body);
  console.log("new data");

  let payload = req.body;

  try {
    let data = await mongoose.model("something").create([payload]);
    console.log(data);
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }
});

router.post("/update-field", async (req, res) => {
  try {
    await mongoose.model(req.body.collection).updateOne(
      {
        _id: req.body.id,
      },
      {
        $set: {
          [req.body.fieldName]: req.body.newValue,
        },
      }
    );
    return res.status(200).send({ message: "Process Succeeded!!" });
  } catch (erre) {
    return res.status(500).send({ message: "Process Failed!!" });
  }
});

router.post("/create-new-material/:collection", async (req, res) => {
  console.log('creating new quiz ......');
  try {
    await mongoose.model(req.params.collection).create([req.body]);
    console.log('creating new quiz completed ......');
    return res.status(201).send({ message: "created" });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

router.delete("/delete-materials/:collection/:id", async (req, res) => {
  try {
    await mongoose.model(req.params.collection).deleteMany();
    return res.status(201).send({ message: "deleted" });
  } catch (err) {
    return res.status(500).send({ message: "failed" });
  }
});
module.exports = router;
