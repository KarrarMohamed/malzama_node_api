const mongoose = require('mongoose');


// ! require [id,collectionName] as query string
exports.fetchMaterialById = async (req, res, next) => {
  let keys = ['id','collectionName'];

  for(let key of keys){
    if(!req.query[key]){
      return res.status(400).send();
    }
  }

    try {
      let data = await mongoose
        .model(req.query.collectionName)
        .findOne({_id:req.query.id})
        .populate("author", "", getAllUsersCollection(req.data.account_type));
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ err });
    }
  };