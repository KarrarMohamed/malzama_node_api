const express = require("express");
const { verifyToken, validateJwt } = require("../../../../middleware/validation");

const { uploadMaterial } = require('../controllers/upload_new_material');
const { deleteMaterial } = require('../controllers/delete_material');
const { editMaterial } = require('../controllers/edit_material');
const { saveMaterial } = require('../controllers/save_material');

const router = express.Router();

/// upload new material pdf,video or quiz
router.post("/new", [verifyToken, validateJwt], uploadMaterial);


// delete material pdf,video or entire quiz
router.get("/delete", [verifyToken, validateJwt], deleteMaterial);

/// edit entire material whether it is lecture , video or quiz
router.post("/edit", [verifyToken, validateJwt], editMaterial);

router.get("/save", [verifyToken, validateJwt], saveMaterial);


module.exports = router;