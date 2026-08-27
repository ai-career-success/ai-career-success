require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const jobDescriptionRoutes = require("./routes/jobDescription.routes");
const matchRoutes = require("./routes/match.routes");

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/resumes", resumeRoutes);
app.use("/job-descriptions", jobDescriptionRoutes);
app.use("/matches", matchRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
