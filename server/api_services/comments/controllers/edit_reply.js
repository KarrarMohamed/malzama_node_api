const mongoose = require("mongoose");

exports.editReply = async (req, res, next) => {

  if(!req.body.comments_collection || !req.body.reply_id || !req.body.reply_content || !req.body.comment_id){
    return res.status(400).send({message:'incomplete or invalid data'});
  }

  try {
    let newReply = await mongoose
      .model(req.body.comments_collection)
      .findOneAndUpdate(
        { _id: req.body.comment_id,"replies._id":req.body.reply_id },
        { $set: { "replies.$.content":req.body.reply_content} },
        { useFindAndModify: false,new:true },
      );


    res.status(200).send({ newReply });
  } catch (err) {
    res.status(500).send({ err });
  }
};