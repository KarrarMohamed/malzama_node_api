const express = require("express");


const {
  fetchData,
  fetchQuizHeadlines,
  fetchQuizQuestions,
  fetchQuizesCount,
} = require("../controllers/comment_controllers/fetch_comments");
const {
  delete_videos_or_lectures_or_quizes,
  edit_quiz_item,
  edit_videos_or_lectures_or_quizes,
  delete_quiz_item,
  add_material_to_my_saved,
} = require("../controllers/materials_controllers/quizes_controllers/delete_quiz_item");
const router = express.Router();

// fetch material
router.get(
  "/fetch-material/:collection",
  [verifyToken, validateJwt],
  fetchData
);







router.get(
  "/fetch-material-no-token/:collection",
  [verifyToken, validateJwt],
  fetchData
);








router.get("/get-material/:collection/:account_type", async (req, res) => {
  try {
    let data = await mongoose
      .model(req.params.collection)
      .find()
      .populate(
        "author",
        "firstName",
        getAllUsersCollection(req.params.account_type)
      );
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ err });
  }
});
module.exports = router;
