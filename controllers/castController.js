const Cast = require("../models/castModel");
const fs = require("fs");
const Movie = require("../models/movieModel");

//Get All Cast
const getAllCast = async (req, res) => {
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
    const casts = await Cast.find().skip(skip).limit(limit).populate("movies");
    res.status(200).send(casts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Get Single Cast
const getSingleCast = async (req, res) => {
  const { id } = req.params;
  try {
    const cast = await Cast.findById(id).populate("movies");
    res.status(200).send(cast);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Create Cast
const createCast = async (req, res) => {
  try {
    const { name, biography, movies } = req.body;
    const cast = new Cast({
      name,
      biography,
      castImage: req.file.path,
      movies,
    });
    await cast.save();
    res.status(201).send(cast);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

//UpdateCast
const updateCast = async (req, res) => {
  try {
    const cast = await Cast.findById(req.params.id);
    req.body.image = req.file ? req.file.path : cast.image;
    if (req.file) {
      fs.unlinkSync(cast.image);
    }
    const updatedCast = await Cast.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(updatedCast);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//DeleteAuthor
const deleteCast = async (req, res) => {
  try {
    const cast = await Cast.findById(req.params.id);
    fs.unlinkSync(cast.image);
    const deletedcast = await cast.remove();
    res.send(deletedcast);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
module.exports = {
  getAllCast,
  getSingleCast,
  createCast,
  updateCast,
  deleteCast,
};
