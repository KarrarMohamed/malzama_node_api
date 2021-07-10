const mongoose = require("mongoose");

exports.rateComment = async (req, res, next) => {
  let keys = [
    "commentId",
    "commentsCollection",
    "newRating",
    "ratingId",
    "authorId",
    "authorOneSignalId",
    "authorNotificationsRepo",
    "materialId",
    "materialCollection",
  ];

  for (let key of keys) {
    if (!req.query[key]) {
      return res.status(400).send();
    }
  }

  // decide whether this user is the first one to rate the current comment or not
  let currentComment = await mongoose
    .model(req.query.commentsCollection)
    .findOne({ _id: req.query.commentId }, { _id: 0, ratings: 1 });

  let ratingCase;
  if (!currentComment) {
    return res.status(404).send();
  } else {
    let listOfIds = currentComment.ratings.filter(
      (rating) => rating.rating_author == req.data._id
    );
    if (listOfIds.length == 0) ratingCase = "new_rate";
    else {
      ratingCase =
        listOfIds[0].rating_type == req.query.newRating
          ? "un_rate"
          : "update_rate";
    }
  }

  let doc = await mongoose.model(req.query.authorNotificationsRepo).findOne(
    {
      material_id: req.query.materialId,
      category: "new_rate",
      "target_audience.user": req.query.authorId,
      specific_entity: req.query.commentId,
    },
    { _id: 1 }
  );
  let notification_id;
  if (doc) {
    notification_id = doc._id;
  }

  let newNotificaiton = {
    text: getNotificationTextOfCommentRating(
      currentComment,
      req.data.firstName,
      req.data.lastName,
      req.query.newRating
    ),
    specific_entity: req.query.commentId,
    material_id: req.query.materialId,
    material_collection: req.query.materialCollection,
    target_audience: {
      user: {
        id: req.query.authorId,
        one_signal_id: req.query.authorOneSignalId,
      },
      school_group: null,
      college_group: null,
    },
    category: "new_rate", // when the user fetch (his\her) notifications , the fetched results will be filtered according to this field
  };

  const session = await mongoose.startSession();

  try {
    await session
      .withTransaction(async () => {
        // save the rating to the right comment

        if (ratingCase == "update_rate") {
          console.log("update an existing rating");
          await mongoose.model(req.query.commentsCollection).updateOne(
            { _id: req.query.commentId, "ratings.rating_author": req.data._id },
            {
              $set: {
                "ratings.$.rating_type": req.query.newRating,
              },
            },
            { session }
          );
        } else if (ratingCase == "un_rate") {
          // deleting rating or unrating
          console.log("unrating");
          await mongoose.model(req.query.commentsCollection).updateOne(
            { _id: req.query.commentId },
            {
              $pull: {
                ratings: {
                  rating_author: req.data._id,
                },
              },
            },
            { session }
          );
        } else {
          console.log("new rating");
          // push new rating  like or in other words dislike helpful or unhelpful
          await mongoose.model(req.query.commentsCollection).updateOne(
            { _id: req.query.commentId },
            {
              $push: {
                ratings: {
                  _id: mongoose.Types.ObjectId(),
                  rating_author: req.data._id,
                  rating_type: req.query.newRating,
                },
              },
            },
            { session }
          );
        }

        // save the new notification
        let notificationToBeSent;
        if (notification_id) {
          await mongoose.model(req.query.authorNotificationsRepo).updateOne(
            { _id: notification_id },
            {
              $set: { text: newNotificaiton["text"] },
            },
            { session }
          );
        } else {
          notificationToBeSent = await mongoose
            .model(req.query.authorNotificationsRepo)
            .create([newNotificaiton]);
        }
        res.status(201).send({
          notify: notification_id ? newNotificaiton : notificationToBeSent,
        });
      })
      .catch((err) => {
        console.log("error inside the error of the rating of a comment");
        res.status(500).send({ err });
      });
  } finally {
    session.endSession(() =>
      console.log("session of the rating a comment has been ended")
    );
  }
};

function getNotificationTextOfCommentRating(
  currentComment,
  firstName,
  lastName,
  rating_type
) {
  let ratorsCount = currentComment.ratings.length;
  let rating_type_text = rating_type ? "Helpful" : "UnHelpful";

  if (ratorsCount == 0) {
    return `${
      firstName + " " + lastName
    } rated your comment as ${rating_type_text}`;
  }

  let firstRator =
    currentComment.ratings[0].rating_author.firstName +
    " " +
    currentComment.ratings[0].rating_author.lastName;

  let secondRator = firstName + " " + lastName;

  let ratingList = [...currentComment.ratings, { rating_type }];

  return `${firstRator} + ' , ' +  ${secondRator} ${
    ratingList.length > 2 ? `and ${ratingList.length - 2} others` : ""
  } have rated your comment ${
    isRatingsAreTheSame(ratingList) ? "as " + rating_type_text : ""
  }`;
}

function isRatingsAreTheSame(ratingsList) {
  let helpfulRatings = ratingsList.filter((rate) => rate.rating_type);

  return (
    helpfulRatings.length == 0 || helpfulRatings.length == ratingsList.length
  );
}
