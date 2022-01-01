const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    moviePoster: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    public: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
