const express = require("express");
const {
  add_Series,
  get_all_Series,
  series_pagination,
  get_Series_by_id,
  series_rating,
  searching_series,
  update_Series,
  delete_Series,
} = require("../controllers/series.controller");
const router = express.Router();
const {upload} = require("../../middleware/multer"); 
const authenticate = require("../../middleware/authenticate");


router.post("/add_series",upload.single('file') , authenticate, add_Series);
router.get("/get_all_series", get_all_Series);
router.get("/series_pagination", series_pagination);
router.get("/get_series_by_id", get_Series_by_id);
router.get("/series_rating", series_rating);
router.get("/searching_series", searching_series);
router.put("/update_series",authenticate, update_Series);
router.delete("/delete_series",authenticate, delete_Series);

module.exports = router;
