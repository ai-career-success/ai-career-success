const { uploadResume, ResumeError } = require("../services/resume.service");

async function upload(req, res, next) {
  try {
    const resume = await uploadResume({
      userId: req.user.sub,
      file: req.file,
      title: req.body?.title,
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: {
        resumeId: resume.id,
        status: resume.status,
      },
    });
  } catch (error) {
    const allowedStatusCodes = [400, 409, 413];
    const statusCode = error instanceof ResumeError && allowedStatusCodes.includes(error.statusCode)
      ? error.statusCode
      : 500;
    const message = statusCode === 500
      ? "Unable to upload resume."
      : error.message;

    return res.status(statusCode).json({
      success: false,
      message,
      errors: [],
    });
  }
}

module.exports = { upload };
