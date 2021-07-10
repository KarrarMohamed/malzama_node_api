const express = require("express");
var { verifyToken, validateJwt } = require("../middleware/validation");
var upload = require("../middleware/uploader");
const user = require("../controllers/university_teacher");

var router = express.Router();

// ANCHOR REGISTRATION AND LOGIN USECASES

// ****************************************** Registration routes ***************************************************

// ANCHOR ------SIGNUP
router.post("/signup", async (req, res, next) => {
  user.signup(req, res, next);
});

// ANCHOR ------CHECK VALIDATION
router.post("/check-validation", async (req, res, next) => {
  user.check_validation(req, res, next);
});

// ANCHOR ------SEND_ME_ANOTHER_VALIDATION_CODE
router.post("/send-me-another-validation-code", async (req, res, next) => {
  user.send_me_another_code(req, res, next);
});

// ANCHOR ------LOGIN
router.post("/login", async (req, res, next) => {
  user.login(req, res, next);
});

// ANCHOR ------ logout
router.post("/logout", async (req, res, next) => {
  user.logout(req, res, next);
});


// ****************************************** end of Registration routes ***********************************************


// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***


// ****************************************************** personal info routes **************************************************
// update personal info
router.post(
  "/update-personal-info",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.update_personal_info(req,res,next);
  }
);

// check validation code after updating info (just when email got changed)
router.post('/check_validation_after_email_change',async(req,res,next) => {
  user.check_validation_after_email_change(req,res,next);
});


// update cover photo
router.post(
  "/upload-cover",
  [verifyToken, validateJwt, upload.single("photo")],
  async (req, res, next) => {
    user.update_cover_photo(req, res, next);
  }
);

// update a profile photo
router.post(
  "/upload-profile",
  [verifyToken, validateJwt, upload.single("photo")],
  async (req, res, next) => {
    user.update_profile_photo(req, res, next);
  }
);

// ************************************************** End of personal info routes ***************************************************


// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***


/// ****************************************** videos routes ****************************************************

// upload new video
router.post(
  "/upload-new-video",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.create_vid(req, res, next);
  }
);

// delete a video
router.delete(
  "/delete-video/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.delete_vid(req, res, next);
  }
);

// update a video
router.patch(
  "/update-video/:id",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.update_vid(req, res, next);
  }
);




// get video by id
router.get(
  "/video/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.show_vid(req, res, next);
  }
);
 // ****************************************************** end of video routes ******************************************


//***
//***
//***
//***
//***
//***
//***
//***
//***
//***
//***
//***
//***
//***
//***
//***
//***
//***



/// ****************************************** lectures routes ****************************************************

// upload a new lecture
router.post(
  "/upload-new-lecture",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.create_lect(req, res, next);
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

// get lecture by id
router.get(
  "/lecture/:id",
  [verifyToken, validateJwt, upload.array("thumbnail")],
  async (req, res, next) => {
    user.show_lect(req, res, next);
  }
);



 // ****************************************************** end of video routes ******************************************


// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ***



 // ****************************************************** Quiz routes ******************************************************

 // upload a new quiz collection
 router.post('/upload-new-quiz',[verifyToken,validateJwt],async(req,res,next) => {
   user.upload_new_quiz(req,res,next);
 });


 // delete a specific quiz collection
 router.delete('/delete-quiz/:id',[verifyToken,validateJwt],async(req,res,next) => {
   user.delete_quiz_collection(req,res,next);
 });

 

// ****************************************************** End of Quiz routes ***********************************************


// get my posts
router.get("/my", [verifyToken, validateJwt], async (req, res, next) => {
  user.my_posts(req, res, next);
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

// call everytime you wanna refresh user data for new changes
router.get(
  "/resignjwt/",
  [verifyToken, validateJwt],
  async (req, res, next) => {
    user.resignjwt(req, res, next);
  }
);

module.exports = router;
