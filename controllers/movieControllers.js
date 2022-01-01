const Movie = require("../models/movieModel");
const fs = require("fs");

const getAllMovies = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const total = await Movie.countDocuments({ public: true });

    const pages = Math.ceil(total / limit);

    if (page > pages) {
      res.status(404).send("NO PAGES");
      return;
    }
    const movies = await Movie.find().skip(skip).limit(limit);

    res.status(200).send(movies);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getAllPublicMovies = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const total = await Movie.countDocuments({ public: true });

    const pages = Math.ceil(total / limit);

    if (page > pages) {
      res.status(404).send("NO PAGES");
      return;
    }
    const movies = await Movie.find({ public: true }).skip(skip).limit(limit);

    res.send(movies);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getPublicMovieDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;
    let movie;

    if (populate) {
      movie = await Movie.find({ public: true, _id: id });
    } else {
      movie = await Movie.find({ public: true, _id: id });
    }

    res.send(movie);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const createMovie = async (req, res) => {
  const { title, rating, trailer, overview, public, user } = req.body;

  try {
    const movie = new Movie({
      title,
      rating,
      moviePoster: req.file.path,
      trailer,
      overview,
      public,
      user,
    });

    await movie.save();
    res.status(201).send(movie);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const editMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const movieToEdit = await Movie.findOne({ _id: id, user: userId });

    req.body.moviePoster = req.file ? req.file.path : movieToEdit.moviePoster;

    if (req.file) {
      fs.unlinkSync(movieToEdit.moviePoster);
    }

    const movie = await Movie.findOneAndUpdate(
      { _id: id, user: userId },
      { ...req.body, public: movieToEdit.public },
      { new: true }
    );
    res.send(movie);
  } catch (error) {
    res.sendStatus(500);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movieToDelete = await Movie.findOne({ _id: id, user: req.user._id });
    fs.unlinkSync(movieToDelete.moviePoster);

    await Movie.findOneAndDelete({ _id: id, user: req.user._id });
    res.status(201).send("Deleted");
  } catch (error) {
    res.sendStatus(500);
  }
};

const togglePublic = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const toggleEdit = await Movie.findOne({ _id: id, user: userId });

    toggleEdit.public = !toggleEdit.public;

    const movie = await toggleEdit.save();

    res.send(movie);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
// 87b 22 23

module.exports = {
  getAllMovies,
  createMovie,
  getAllPublicMovies,
  getPublicMovieDetail,
  editMovie,
  deleteMovie,
  togglePublic,
};
