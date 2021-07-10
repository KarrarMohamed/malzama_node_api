const express = require('express');
const router = express.Router();
const materialEditingManager = require('../controllers/edit_and_delete_materials');


// Edit video or lecture
router.post('/edit',materialEditingManager.edit_videos_or_lectures_or_quizes);


// delete video or lecture
router.post('/delete',materialEditingManager.delete_videos_or_lectures_or_quizes);



module.exports = router;