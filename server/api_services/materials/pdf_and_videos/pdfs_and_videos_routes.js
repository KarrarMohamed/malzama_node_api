const express = require("express");
const { verifyToken, validateJwt } = require("../../../middleware/validation");

const { fetchMaterialById } = require("./controllers/fetch_by_id");
const { fetchMaterials } = require("./controllers/fetch_material");
const { fetchMaterialsOnRefresh } = require("./controllers/fetch_material_on_refresh");
const {
  fetchSavedVideosOrPDF,
} = require("./controllers/fetch_saved_materials");
const router = express.Router();

// fetch material by id (only for videos and quizes)
router.get("/fetchById", [verifyToken, validateJwt], fetchMaterialById);

// fetch a bunch of material usually in pagination style

router.get("/fetch", [verifyToken, validateJwt], fetchMaterials);

// fetch a bunch of saved materials

router.get(
  "/fetch-saved-materials",
  [verifyToken, validateJwt],
  fetchSavedVideosOrPDF
);

router.get(
  "/fetch-materials-on-refresh",
  [verifyToken, validateJwt],
  fetchMaterialsOnRefresh
);

module.exports = router;
