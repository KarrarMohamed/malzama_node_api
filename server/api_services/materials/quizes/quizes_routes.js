const express = require("express");

const router = express.Router();

const { verifyToken, validateJwt } = require("../../../middleware/validation");

const { fetchQuizesHeaders } = require("./controllers/fetch_quiz_headers");
const { fetchQuizQuestions } = require("./controllers/fetch_quiz_questions");
const { fetchQuizesCount } = require("./controllers/fetch_quizes_count");
const { editQuizItem } = require("./controllers/edit_quiz_item");
const { deleteQuizItem } = require("./controllers/delete_quiz_item");
const { fetchQuizById } = require("./controllers/fetch_quiz_by_id");
const { fetchSavedQuizesHeaders } = require("./controllers/fetch_saved_quizes");
const {
  fetchQuizHeadersOnRefresh,
} = require("./controllers/fetch_quiz_headers_on_refresh");
const {
  fetchAllQuizQuestions,
} = require("./controllers/fetch_all_quiz_questions");
const { editEntireQuiz } = require("./controllers/edit_entire_quiz");

// fetch all quizes with all fields except questions
router.get(
  "/fetch-quizes-headers",
  [verifyToken, validateJwt],
  fetchQuizesHeaders
);

// fetch quiz questions 8 by 8
router.get(
  "/fetch-quiz-questions",
  [verifyToken, validateJwt],
  fetchQuizQuestions
);

//fetch quizes count
router.get("/fetch-quizes-count", [verifyToken, validateJwt], fetchQuizesCount);

/// edit a single quiz question
router.post("/edit-quiz-item", [verifyToken, validateJwt], editQuizItem);

/// delete single quiz question
router.get("/delete-quiz-item", [verifyToken, validateJwt], deleteQuizItem);

// fetch single quiz by id
router.get("/fetchById", [verifyToken, validateJwt], fetchQuizById);

// fetch saved quizes headers
router.get(
  "/fetch-saved-quizes-headers",
  [verifyToken, validateJwt],
  fetchSavedQuizesHeaders
);

router.get(
  "/fetch-quizes-headers-on-refresh",
  [verifyToken, validateJwt],
  fetchQuizHeadersOnRefresh
);

router.get(
  "/fetch-all-questions",
  [verifyToken, validateJwt],
  fetchAllQuizQuestions
);

router.post('/edit-entire-quiz',[verifyToken,validateJwt],editEntireQuiz);
module.exports = router;
