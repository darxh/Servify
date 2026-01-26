// const express = require("express");
// const router = express.Router();

// const {
//   createService,
//   getAllServices,
//   getServiceById,
//   deleteService,
//   updateService,
// } = require("../controllers/serviceController");

// const { protect, authorize } = require("../middleware/authMiddleware");
// const upload = require("../config/cloudinary");

// router.get("/", getAllServices);
// router.get("/:id", getServiceById);
// router.post("/", protect, authorize("provider", "admin"), upload.single("image"), createService);
// router.put("/:id", protect, authorize("provider", "admin"), upload.single("image"), updateService);
// router.delete("/:id", protect, authorize("provider", "admin"), deleteService);

// module.exports = router;

// Server/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();

const {
  createService,
  getAllServices,
  getServiceById,
  deleteService,
  updateService,
} = require("../controllers/serviceController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../config/cloudinary");

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", protect, authorize("provider", "admin"), upload.single("image"), createService);
router.put("/:id", protect, authorize("provider", "admin"), upload.single("image"), updateService);
router.delete("/:id", protect, authorize("provider", "admin"), deleteService);

module.exports = router;
