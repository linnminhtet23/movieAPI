const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const castSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    castImage: {
      type: String,
      required: true,
    },
    biography: {
      type: String,
      required: true,
    },
    movies: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  },
  { timestamps: true }
);
const Cast = mongoose.model("Cast", castSchema);
module.exports = Cast;
