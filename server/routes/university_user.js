const express = require("express");
var { verifyToken, validateJwt } = require("../middleware/validation");
var upload = require("../middleware/uploader");
const user = require("../controllers/university_user");

var router = express.Router();

// ANCHOR ------signup
router.post("/signup", async (req, res, next) => {
  user.signup(req, res, next);
});

// ANCHOR ------CHECK_VALIDATION
router.post("/check-validation", async (req, res, next) => {
  user.check_validation(req, res, next);
});

// ANCHOR ------SEND_ME_ANOTHER_VALIDATION_CODE
router.post("/send-me-another-validation-code", async (req, res, next) => {
  user.send_me_another_code(req, res, next);
});

// ANCHOR ------login
router.post("/login", async (req, res, next) => {
  user.login(req, res, next);
});

// ANCHOR ------ logout

router.post("/logout", async (req, res, next) => {
  user.logout(req, res, next);
});



// update personal info
router.post(
  "/update-personal-info",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    console.log('inside here .....');
    
    console.log(req.data);
    
    user.update_personal_info(req,res,next);
  }
);


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

//[END OF REGISTRATION ROUTES]
// **************************************************************************
// **************************************************************************
// **************************************************************************
// **************************************************************************

// show a lecture
router.get(
  "/lecture/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.show_lect(req, res, next);
  }
);

// show a video
router.get(
  "/video/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.show_vid(req, res, next);
  }
);

/// Complete credential saving after signing up
router.post(
  "/complete-credentials",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.update(req, res, next);
  }
);

// send another validation mail via node mailer
router.post(
  "/get-another-validation-mail",
  /*[verifyToken, validateJwt],*/ async (req, res, next) => {
    user.get_email(req, res, next);
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
