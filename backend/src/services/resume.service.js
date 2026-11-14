const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const resumeRepository = require("../repositories/resume.repository");

const configuredMaxUploadMb = Number(process.env.MAX_UPLOAD_MB);
const MAX_UPLOAD_MB = Number.isFinite(configuredMaxUploadMb) && configuredMaxUploadMb > 0
  ? configuredMaxUploadMb
  : 5;

class ResumeError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ResumeError";
    this.statusCode = statusCode;
  }
}

async function uploadResume({ userId, file, title }) {
  if (!file) {
    throw new ResumeError(400, "A resume file is required.");
  }

  const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : null;
  const fileSize = Math.max(Number(file.size) || 0, buffer ? buffer.length : 0);
  if (fileSize > MAX_UPLOAD_MB * 1024 * 1024) {
    throw new ResumeError(413, `Resume must be ${MAX_UPLOAD_MB} MB or smaller.`);
  }

  if (file.mimetype !== "application/pdf") {
    throw new ResumeError(400, "Only PDF files are allowed.");
  }

  if (!buffer || buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new ResumeError(400, "The uploaded file is not a valid PDF.");
  }

  let resumeTitle = typeof title === "string" ? title.trim() : "";
  if (!resumeTitle) {
    resumeTitle = path.basename(file.originalname || "").replace(/\.pdf$/i, "").trim();
  }
  if (!resumeTitle) {
    throw new ResumeError(400, "A resume title is required.");
  }
  if (resumeTitle.length > 150) {
    throw new ResumeError(400, "Resume title must be 150 characters or fewer.");
  }

  const uploadDir = process.env.UPLOAD_DIR || "./uploads";
  const storedFilename = `${crypto.randomUUID()}.pdf`;
  const storagePath = path.join(uploadDir, storedFilename);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(storagePath, buffer);
  } catch {
    try {
      await fs.unlink(storagePath);
    } catch {
      // The write may have failed before creating a file.
    }
    throw new ResumeError(500, "Unable to save the uploaded resume.");
  }

  try {
    return await resumeRepository.createResume({
      userId,
      title: resumeTitle,
      originalFilename: file.originalname || "",
      storagePath,
    });
  } catch (error) {
    try {
      await fs.unlink(storagePath);
    } catch {
      // Preserve the database error if cleanup is not possible.
    }

    if (error.code === "23505" || error.meta?.code === "23505") {
      throw new ResumeError(409, "You already have a resume with this title.");
    }
    throw error;
  }
}

module.exports = { uploadResume, ResumeError };
