const express = require("express");
const authMiddleWare = require("../middlewares/auth");
const adminMiddleWare = require("../middlewares/admin");
const fileUpload = require("../middlewares/fileUpload");
const validatReq = require("../middlewares/validateReq");
const {
  createMovie,
  getAllMovies,
  getAllPublicMovies,
  getPublicMovieDetail,
  editMovie,
  deleteMovie,
  togglePublic,
} = require("../controllers/movieControllers");
const movieCreateSchema = require("../schema/Movie/movieCreateSchema");
const movieEditSchema = require("../schema/Movie/movieEditSchema");
const validateReq = require("../middlewares/validateReq");
const router = express.Router();

//GET ALL MOVIE
router.get("/", authMiddleWare, adminMiddleWare, getAllMovies);

//GET PUBLIC MOVIES
router.get("/public", getAllPublicMovies);

//GET PUBLIC MOVIE DETAIL
router.get("/public/:id", getPublicMovieDetail);

//CREATE MOVIE
router.post(
  "/",
  authMiddleWare,
  adminMiddleWare,
  fileUpload.single("moviePoster"),
  movieCreateSchema,
  validatReq,
  createMovie
);

//UPDATE MOVIE
router.put(
  "/:id",
  authMiddleWare,
  adminMiddleWare,
  fileUpload.single("moviePoster"),
  movieEditSchema,
  validateReq,
  editMovie
);

//DELETE MOVIE
router.delete("/:id", authMiddleWare, adminMiddleWare, deleteMovie);

//TOGGLING PUBLIC - ADMIN USER
router.put("/public/:id", authMiddleWare, adminMiddleWare, togglePublic);

module.exports = router;
