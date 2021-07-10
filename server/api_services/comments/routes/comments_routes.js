const express = require("express");

const {commentOnMaterial} = require("../controllers/comment_on_materials");
const {deleteComment} = require("../controllers/delete_comment");
const {editComment} = require("../controllers/edit_comment");
const {replyToComment} = require("../controllers/reply_to_comment");
const {editReply} = require("../controllers/edit_reply");
const {deleteReply} = require("../controllers/delete_reply");
const {rateComment} = require("../controllers/rate_comment");
const {fetchComments} = require("../controllers/fetch_comments");
const {verifyToken, validateJwt} = require('../../../middleware/validation')
const router = express.Router();

// fetch comments
router.get("/fetch-comments", [verifyToken, validateJwt], fetchComments);

// new comment
router.post("/new-comment", [verifyToken, validateJwt], commentOnMaterial);

// edit comment
router.post("/edit-comment", [verifyToken, validateJwt], editComment);

// delete comment
router.get("/delete-comment", [verifyToken, validateJwt], deleteComment);

// rate a comment as helpful or not
router.get("/rate-comment", [verifyToken, validateJwt], rateComment);

// new reply
router.post("/new-reply", [verifyToken, validateJwt], replyToComment);

// edit reply
router.post("/edit-reply", [verifyToken, validateJwt], editReply);

// delete reply
router.get("/delete-reply", [verifyToken, validateJwt], deleteReply);

//

module.exports = router;
