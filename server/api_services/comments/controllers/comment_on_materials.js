const mongoose = require("mongoose");
// author id , onesignal collection name
// content
// target material _id

// 5 credentials required
/**
 *  material_collection   => the name of the collection that holds the material
 *  material_id           => _id of the material
 * notification_repo      => ex: uniteacheersNotifi , unistudentsNotifi
 * author_id              => the _id of the author or owner of the material
 * material_type          => lecture or video
 * comment_collection     => unilectcomments or schvideocomments .. etc
 */
exports.commentOnMaterial = async (req, res, next) => {
  let newComment;
  console.log(req.body);
  let {
    //material specific
    material_collection,
    material_id,
    material_type,
    comments_collection,

    // author specific
    author_notifications_repo,
    author_one_signal_id,
    author_id,
  } = req.body; // here is the author of the material
  if (
    !material_collection ||   //*
    !material_id ||           //*
    !material_type ||         //*
    !author_notifications_repo ||
    !author_one_signal_id ||
    !comments_collection ||       //*
    !author_id
  ) {
    return res
      .status(500)
      .send({ message: "incomplete data about the material author" });
  }

  newComment = {
    author:req.data._id ,
    content: req.body.content,
    post_date:Date.now(),
    [material_type]: material_id,
  };

  const session = await mongoose.startSession();

  try {
    await session
      .withTransaction(async () => {
        // insert the comment into the comment collection
        let insertedComment = await mongoose
          .model(comments_collection)
          .create([newComment], { session });

        // save the new comment id into the material collection in the comments field
        await mongoose.model(material_collection).updateOne(
          { _id: material_id },
          {
            $push: {
              comments: insertedComment[0]._id,
            },
          },
          { session }
        );

        // save a new notification in the notification collection of the material author

        let commnetsList = await mongoose
          .model(comments_collection)
          .find({},{},{session})
          .lean();

        let newNotification = {
          author:req.data._id,
          text: req.body.notificationText,
          material_id,
          material_collection,
          category: "new_comment",
          comment_id:insertedComment[0]._id,
          target_audience: {
            user: {
              id: author_id,
              one_signal_id: author_one_signal_id,
            },
            school_group: null,
            college_group: null,
          },
        };

        let singleNotification = await mongoose
          .model(author_notifications_repo)
          .findOne({
            category: "new_comment",
            material_id,
            material_collection,
            "target_audience.user.id": author_id,
          },{},{session})
          .lean();
        let newSavedNotification;

        if (singleNotification) {
          if (singleNotification.text == newNotification.text) {
            res.status(201).send({ notification:singleNotification,newComment:insertedComment[0]});
          } else {
            newSavedNotification = await mongoose
              .model(author_notifications_repo)
              .findOneAndUpdate(
                {
                  category: "new_comment",
                  material_id,
                  material_collection,
                  "target_audience.user": author_one_signal_id,
                },
                {
                  $set: {
                    text: newNotification.text,
                  },
                },
                { session, useFindAndModify: false }
              );
              console.log(insertedComment[0]);
            res.status(201).send({notification:newSavedNotification,newComment:insertedComment[0]});
          }
        } else {
          newSavedNotification = await mongoose
            .model(author_notifications_repo)
            .create([newNotification], { session });
            console.log(insertedComment[0]);
          res.status(201).send({notification:newSavedNotification,newComment:insertedComment[0]});
        }
      })
      .catch((err) => {
        console.log(
          "error inside the catch block of adding a new comment to materials"
        );
        console.log(err);
        res.status(500).send({ err });
      });
  } finally {
    session.endSession(() => {
      console.log("session of adding a new comment has been ended");
      return;
    });
  }
};



let newComentNotification = {
  author:'sdaksajklsajlkjsadkljdaskj',
  text:'someone commented on your post',
  category:'new_comment',
  materialId:'sdasd',
  material_collection:'dasdasd',
  commentId:'dasdasd',
  target_audience:{
    user:{
      _id:'dsada screen',
      one_signal_id:'dasdas'
    },
    college_group:'asd',
    school_group:'asdasd'
  }
}


let newReplyNotification = {
  text:'someone replied to your comment on your post',
  category:'new_reply',
  materialId:'sdasd',
  material_collection:'dasdasd',
  commentId:'dasdasd',
  target_audience:{
    user:{
      _id:'dsada screen',
      one_signal_id:'dasdas'
    },
    college_group:'asd',
    school_group:'asdasd'
  }
}
let newRatingNotification = {
  text:'someone rated your post',
  category:'new_rating',
  materialId:'sdasd',
  material_collection:'dasdasd',
  commentId:'dasdasd',
  target_audience:{
    user:{
      _id:'dsada screen',
      one_signal_id:'dasdas'
    },
    college_group:'asd',
    school_group:'asdasd'
  }
}

let newUploadNotification = {
  text:'someone uploaded new lecture',
  category:'new_material',
  materialId:'sdasd',
  material_collection:'dasdasd',
  commentId:null,
  target_audience:{
    user:{
      _id:'dsada screen',
      one_signal_id:'dasdas'
    },
    college_group:'asd',
    school_group:'asdasd'
  }
}