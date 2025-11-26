const express = require("express");
const router = express.Router();

const {
  createService,
  getAllServices,
  getServiceById,
  deleteService,
} = require("../controllers/serviceController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", protect, authorize("provider", "admin"), createService);
router.delete("/:id", protect, authorize("provider", "admin"), deleteService);

module.exports = router;
