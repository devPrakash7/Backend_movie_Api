const express = require("express");
const {
  add_movie,
  get_all_movie,
  get_movie_by_id,
  movie_rating,
  searching_movie,
  movie_pagination,
  update_movie,
  delete_movie,
} = require("../controllers/movie.controller");
const {upload} = require('../../middleware/multer');
const authenticate = require("../../middleware/authenticate");

const router = express.Router();

router.post("/addMovie",upload.single('file'),authenticate, add_movie);
router.get("/get_all_movie", get_all_movie);
router.get("/get_movie_by_id", get_movie_by_id);
router.get("/movie_rating", movie_rating);
router.get("/search_movie", searching_movie);
router.get("/movie_rating" , movie_rating)
router.get("/movie_pagination", movie_pagination);
router.put("/update_movie",authenticate, update_movie);
router.delete("/delete_movie",authenticate, delete_movie);

module.exports = router;
