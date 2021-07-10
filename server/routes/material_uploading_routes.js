const express = require('express');
const router = express.Router();
const uploadManager = require('../controllers/material_uploading');
const { validateJwt, verifyToken } = require('../middleware/validation');


// route for uploading video , pdf and quiz
router.post('/new-material',[verifyToken,validateJwt],uploadManager.upload_new_material);


module.exports = router;