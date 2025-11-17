const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("servify api is running...(from router)");
});

module.exports = router;