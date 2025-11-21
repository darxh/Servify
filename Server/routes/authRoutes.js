const express = require("express");
const router = express.Router();

const { registeUser } = require("../controllers/authController");

router.post("/register", registeUser);

module.exports = router;
