const mongoose = require("mongoose");


exports.editMaterial = async (req, res, next) => {
    try {
      let updatePayload = {};
      let entries = Object.entries(req.body).filter(
        (record) => record[0] != "id" && record[0] != "collectionName"
      );
      let isQuizUpdate =
        req.body.collectionName == "uniquizes" ||
        req.body.collectionName == "schquizes";
  
      for (entry of entries) {
        updatePayload[entry[0]] = entry[1];
      }
  
      let listOfIDs = [];
      if (isQuizUpdate) {
        let questions = req.body.questions;
        questions = questions.map((item) => {
          let newId = new mongoose.Types.ObjectId();
          item._id = newId;
          listOfIDs.push(newId);
          return item;
        });
  
        updatePayload.questions = questions;
      }
      let saved = await mongoose
        .model(req.body.collectionName)
        .findByIdAndUpdate(
          req.body.id,
          { $set: { ...updatePayload } },
          { useFindAndModify: false, new: true }
        );
      let payload = { _id: saved._id };
      if (isQuizUpdate) {
        payload["ids_list"] = listOfIDs;
      }
      return res.status(200).send({ data: payload });
    } catch (err) {
      
      return res.status(500).send({ err });
    }
  };



  let updates = {

    _id:'a1',
    name:'some_name',
    items:[
      {
        _id:1,
        name:'item11',
      },
      {
        _id:2,
        name:'item22',
      },
      {
        _id:3,
        name:'item33',
      },
      {
        _id:4,
        name:'item44',
      },
    ]
  }