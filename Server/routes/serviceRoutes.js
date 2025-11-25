const express = require("express");
const router = express.Router();

const {
  createService,
  getAllServices,
  getServiceById,
} = require("../controllers/serviceController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", protect, authorize("provider", "admin"), createService);

module.exports = router;
