const mongoose = require("mongoose");

exports.replyToComment = async (req, res, next) => {

  console.log('we are creating a new reply');
  let {
    comments_collection,
    comment_id,
    author_id,
    author_notifications_repo,
    author_one_signal_id,
    material_id,
    material_collection,
    reply_content,
  } = req.body;

  // author == author or the creator of the comment
  // to which we are saving a new reply from someone

  if (
    !comments_collection ||
    !comment_id ||
    !author_id ||
    !author_notifications_repo ||
    !material_id ||
    !material_collection ||
    !author_one_signal_id || 
    !reply_content
  ) {
    
    return res.status(400).send({ message: "incomplete data" });
  }

  let newReply = {
    _id: new mongoose.Types.ObjectId(),
    reply_author: req.data._id,
    content: reply_content,
    post_date:Date.now(),
  };

  const session = await mongoose.startSession();

  try {
    await session
      .withTransaction(async () => {
        // save the new reply to the comment replies field
        await mongoose.model(comments_collection).updateOne(
          { _id: comment_id },
          {
            $push: {
              replies: newReply,
            },
          },
          { session }
        );

        let availableReplies = await mongoose
          .model(comments_collection)
          .findOne({ _id: comment_id }, { replies: true }, { session });

        let newNotification = {
          text: getNotificationTextOfNewReply(
            availableReplies['replies'],
            req.data.firstName,
            req.data.lastName,
            req.data._id
          ),
          category: "new_reply",
          specific_entity: comment_id,
          material_id,
          material_collection,
          target_audience: {
            user: {
              id: author_id,
              one_signal_id: author_one_signal_id,
            },
            school_group: null,
            college_group: null,
          },
        };

        // save the new notficiation to the notification repo of the author

        let singleReply = await mongoose
          .model(author_notifications_repo)
          .findOne(
            {
              category: "new_reply",
              material_id,
              material_collection,
              specific_entity: comment_id,
              "target_audience.user.id": author_id,
            },
            {},
            { session }
          );

        let newSavedNotification;
        if (singleReply) {
          if (singleReply.text == newNotification.text) {
            res.status(201).send({ updatedNotification:singleReply,newReply });
          } else {
             await mongoose
              .model(author_notifications_repo)
              .findOneAndUpdate(
                {
                  category: "new_reply",
                  material_id,
                  material_collection,
                  "target_audience.user.id": author_id,
                },
                {
                  $set: {
                    text: newNotification.text,
                  },
                },
                {
                  useFindAndModify: false,
                  session,
                }
              );
            res.status(201).send({newReply,updatedNotification:newNotification});
          }
        } else {
          newSavedNotification = await mongoose
            .model(author_notifications_repo)
            .create([newNotification], { session });
          res.status(201).send({newReply,updatedNotification:newSavedNotification });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({err});
      });
  } finally {
    session.endSession(() =>
      console.log("session of replying to a comment has been ended")
    );
  }
};

function getNotificationTextOfNewReply(
  replies,
  firstName,
  lastName,
  replier_id
) {
  if(replies){
    replies.reverse();
  }else{
    replies = [];
  }
  let text_tail = "replied to your comment";
  let firstReplier = firstName + " " + lastName;
  let others = replies.filter((reply) => reply.reply_author != replier_id);

  if (others.length == 0) {
    return `${firstReplier} ${text_tail}`;
  }

  let secondReplier =
    others[0].author.firstName + " " + others[0].author.lastName;

  let isMany = others.length > 1;

  let joiner = `${firstReplier} ${isMany ? "," : "and"} ${secondReplier} ${
    isMany ? "and" + " " + others.length - 1 + "others" : ""
  } `;

  return joiner + text_tail;
}
