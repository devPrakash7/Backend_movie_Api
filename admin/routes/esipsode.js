const express = require("express");
const { add_episode, get_all_episode } = require("../controllers/episode.controller");
const router = express.Router();

router.post("/add_episode", add_episode);
router.get('/get_all_episode' , get_all_episode)



module.exports = router;
