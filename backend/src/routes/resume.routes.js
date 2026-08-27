const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();
router.use(requireAuth);

router.get("/", (_req, res) => {
  res.json({ items: [], message: "Resume listing is not implemented yet" });
});

module.exports = router;
