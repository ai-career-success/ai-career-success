const express = require("express");
const multer = require("multer");
const { requireAuth } = require("../middleware/auth.middleware");
const resumeController = require("../controllers/resume.controller");

const configuredMaxUploadMb = Number(process.env.MAX_UPLOAD_MB);
const MAX_UPLOAD_MB = Number.isFinite(configuredMaxUploadMb) && configuredMaxUploadMb > 0
  ? configuredMaxUploadMb
  : 5;

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
});

router.get("/", requireAuth, (_req, res) => {
  res.json({ items: [], message: "Resume listing is not implemented yet" });
});

router.post("/", requireAuth, upload.single("resumeFile"), resumeController.upload);

router.use((error, _req, res, next) => {
  if (!(error instanceof multer.MulterError)) {
    return res.status(400).json({
      success: false,
      message: "Unable to process the uploaded file.",
      errors: [],
    });
  }

  const isTooLarge = error.code === "LIMIT_FILE_SIZE";
  return res.status(isTooLarge ? 413 : 400).json({
    success: false,
    message: isTooLarge
      ? `Resume must be ${MAX_UPLOAD_MB} MB or smaller.`
      : "Unable to process the uploaded file.",
    errors: [],
  });
});

module.exports = router;
