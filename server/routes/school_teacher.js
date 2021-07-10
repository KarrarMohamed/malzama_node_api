const express = require("express");
var { verifyToken, validateJwt } = require("../middleware/validation");
var upload = require("../middleware/uploader");
const user = require("../controllers/school_teachers");
const {SchLect,SchVideo} = require('../models/index');

var router = express.Router();

router.get("/fuck-off", (req, res) => {
  user.deleteAll(req, res);
});

router.get("/read-data", async (req, res) => {
  user.readAll(req, res);
});

router.get('/read-sch-lectures',async(req,res) => {
  try {
    let docs = await SchLect.find({});
  res.status(200).json({docs});
  } catch (err) {
    res.status(500).send({err});
  }
});

router.get('/delete-sch-lectures',async(req,res) => {
  try {
    await SchLect.deleteMany({});
  res.status(200).send({message:'lectures deleted successfully'});
  } catch (err) {
    res.status(500).send({err});
  }
});

router.get('/read-sch-videos',async(req,res) => {
  try {
    let docs = await SchVideo.find({});
  res.status(200).send({docs});
  } catch (err) {
    res.status(500).send({err});
  }
});

router.get('/delete-sch-videos',async(req,res) => {
  try {
    await SchVideo.deleteMany({});
  res.status(200).send({message:'Videos deleted successfully'});
  } catch (err) {
    res.status(500).send({err});
  }
});
// ANCHOR REGISTRATION AND AUTHENTICATION USECASES

//  ANCHOR ------  signup
router.post("/signup", async (req, res, next) => {
  user.signup(req, res, next);
});

// ANCHOR ------  CHECK VALIDATION
router.post("/check-validation", async (req, res, next) => {
  user.check_validation(req, res, next);
});

// ANCHOR ------  SEND_ME_ANOTHER_VALIDATION_CODE
router.post("/send-me-another-validation-code", async (req, res, next) => {
  user.send_me_another_code(req, res, next);
});

//ANCHOR ------  login
router.post("/login", async (req, res, next) => {
  user.login(req, res, next);
});

// ANCHOR ------ logout

router.post("/logout", [verifyToken, validateJwt], async (req, res, next) => {
  user.logout(req, res, next);
});

// update cover, profile photo

router.post(
  "/upload-cover",
  [verifyToken, validateJwt, upload.single("photo")],
  async (req, res, next) => {
    user.update_cover_photo(req, res, next);
  }
);

router.post(
  "/upload-profile",
  [verifyToken, validateJwt, upload.single("photo")],
  async (req, res, next) => {
    user.update_profile_photo(req, res, next);
  }
);

//******************************************************************************************* */
//******************************************************************************************* */
//******************************************************************************************* */

// update personal info

router.post(
  "/update-personal-info",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.update_personal_info(req,res,next);
  }
);
// upload a lecture
router.post(
  "/upload-new-lecture",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.create_lect(req, res, next);
  }
);

// upload a video
router.post(
  "/upload-new-video",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.create_vid(req, res, next);
  }
);

// delete a video
router.delete(
  "/video/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.delete_vid(req, res, next);
  }
);

// update a video
router.patch(
  "/video/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.update_vid(req, res, next);
  }
);

// delete a lecture
router.delete(
  "/lecture/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.delete_lect(req, res, next);
  }
);

// update a lecture
router.patch(
  "/lecture/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.update_lect(req, res, next);
  }
);

// show a lecture
router.get(
  "/lecture/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.show_lect(req, res, next);
  }
);


// send lecture file
router.post('/send-me-lecture',[verifyToken, validateJwt],async (req,res,next) => {
  user.send_me_lecture(req,res,next);
});

// show a video
router.get(
  "/video/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.show_vid(req, res, next);
  }
);

// get my posts
router.get("/my", [verifyToken, validateJwt], async (req, res, next) => {
  user.my_posts(req, res, next);
});

/// Complete credential saving after signing up
router.post(
  "/complete-credentials",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.update(req, res, next);
  }
);

// delete a user (set him as inactive) (admin)
router.delete("/", [verifyToken, validateJwt], async (req, res, next) => {
  user.delete_acc(req, res, next);
});

// homepage
router.get("/:skip", [verifyToken, validateJwt], async (req, res, next) => {
  user.homepage(req, res, next);
});

// homepage
router.get(
  "/search/:phone/:skip",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.search(req, res, next);
  }
);

// get own data
router.get("/getInfo", [verifyToken, validateJwt], async (req, res, next) => {
  user.getInfo(req, res, next);
});

// get a specific user
router.get("/:id", async (req, res, next) => {
  user.visit_teacher(req, res, next);
});

// confirm email authentication
router.get("/auth/:id", async (req, res, next) => {
  user.confirm_email(req, res, next);
});

// change users role to tutor
router.post(
  "/change-role",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.update(req, res, next);
  }
);

// call everytime you wanna refresh user data for new changes
router.get(
  "/resignjwt/",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.resignjwt(req, res, next);
  }
);

module.exports = router;
