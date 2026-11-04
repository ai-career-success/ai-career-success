const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// User registration handled via layered controller -> service -> repository
router.post("/register", (req, res) => authController.register(req, res));

router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
