const { body } = require("express-validator");

const movieCreateSchema = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Please Fill Movie Title"),
  body("rating").exists({ checkFalsy: true }).withMessage("Please Fill Rating"),
  body("trailer")
    .exists({ checkFalsy: true })
    .withMessage("Please Fill Trailer link"),
  body("overview")
    .exists({ checkFalsy: true })
    .withMessage("Please Fill MovieOverview"),
  body("public")
    .exists({ checkFalsy: true })
    .withMessage("Please Fill Post Type"),
  body("user").exists({ checkFalsy: true }).withMessage("Please Fill User"),
];

module.exports = movieCreateSchema;
