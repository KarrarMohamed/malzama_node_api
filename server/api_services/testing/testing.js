const express = require("express");

const mongoose = require("mongoose");

const router = express.Router();
let collections = [
  "uniquizes",
  "schquizes",
  "univideos",
  "schvideos",
  "unilectures",
  "schlectures",
];

let users = [
  "uniteachers",
  "unistudents",
  "schteachers",
  "schstudents",
  "schusers",
  "uniusers",
];

let comments = ["schLecturesComments"];
router.get("/delete-all-materials", async (req, res, next) => {
  try {
    for (let item of collections) {
      await mongoose.model(item).deleteMany();
    }
    res.status(200).send();
  } catch (erre) {
    res.status(500).send();
  }
});

router.get("/fetch/:collection", async (req, res) => {
  try {
    let data = await mongoose.model(req.params.collection).find();
  return res.status(200).send({data});
  } catch (error) {
    return res.status(500).send({error});
  }
});

module.exports = router;