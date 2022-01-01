const express = require("express");
const {
  getAllCast,
  getSingleCast,
  createCast,
  updateCast,
  deleteCast,
} = require("../controllers/castController");
const adminMiddleWare = require("../middlewares/admin");
const authMiddleWare = require("../middlewares/auth");
const fileUpload = require("../middlewares/fileUpload");
const validateReq = require("../middlewares/validateReq");
const router = express.Router();
router.get("/", getAllCast);
router.get("/:id", getSingleCast);

router.post(
  "/",
  authMiddleWare,
  adminMiddleWare,
  fileUpload.single("castImage"),
  validateReq,
  createCast
);
router.put(
  "/:id",
  authMiddleWare,
  adminMiddleWare,
  fileUpload.single("castImage"),
  validateReq,
  updateCast
);
router.delete("/:id", authMiddleWare, adminMiddleWare, deleteCast);
module.exports = router;
