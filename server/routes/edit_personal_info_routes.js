const express = require('express');
const { edit_personal_info } = require('../controllers/edit_personal_info');
const { upload_new_cover_or_profile_picture } = require('../controllers/upload_profile_or_cover_pic');
const router = express.Router();

// edit personal info
router.post('/edit-personal-info',edit_personal_info);

// upload new profile or cover picture
router.post('/upload-personal-picture',upload_new_cover_or_profile_picture);




module.exports = router;