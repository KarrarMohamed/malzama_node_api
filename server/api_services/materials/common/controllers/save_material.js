const mongoose = require("mongoose");


// ! require [id , fieldName,indicator] as query string
// ! indicator is either add or pull
exports.saveMaterial = async (req, res, next) => {
  let keys = ["id", "fieldName","indicator"];
  for (let key of keys) {
    if (!req.query[key]) {
      return res.status(400).send();
    }
  }



    try {
        if(req.query.indicator == 'add'){
          await mongoose.model(req.data.account_type).updateOne(
            { _id: req.data._id },
            {
              $push: {
                [req.query.fieldName]: req.query.id,
              },
            }
          );
        }else{

          await mongoose.model(req.data.account_type).updateOne(
            { _id: req.data._id },
            {
              $pull: {
                [req.query.fieldName]: req.query.id,
              },
            }
          );
        }

      
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send();
    }
  };