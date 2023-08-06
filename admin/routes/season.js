const express = require("express");
const { add_season, get_all_season } = require("../controllers/season.controller");
const router = express.Router();

router.post("/add_season", add_season);
router.get('/get_all_season' , get_all_season)



module.exports = router;
