const express = require("express");
const { verifyToken,validateJwt } = require("../../middleware/validation");
const {
  verifyAndUpdateInfo,
} = require("./controllers/check_verification_while_updating");
const { deleteBio, editBio } = require("./controllers/edit_and_delete_bio");
const { uploadPicture } = require("./controllers/edit_pics");

const { setGeneralInfo } = require("./controllers/set_general_info");

const router = express.Router();

// signup
router.post(
  "/update-personal-info",
  [verifyToken, validateJwt],
  setGeneralInfo
);

// login
router.post(
  "/verify-and-update-info",
  [verifyToken, validateJwt],
  verifyAndUpdateInfo
);

// edit bio
router.get("/edit-bio", [verifyToken, validateJwt], editBio);

// delete bio
router.get('/delete-bio',[verifyToken, validateJwt],deleteBio);

// edit profile pictures
router.get(
  "/delete-picture",
  [verifyToken, validateJwt],
  uploadPicture
);

router.get(
  "/upload-picture",
  [verifyToken, validateJwt],
  uploadPicture
);
module.exports = router;
