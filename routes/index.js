const express = require("express");

const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
  res.render("home", { page: "static" });
});

router.get("/about", (req, res) => {
  res.render("about", { page: "static" });
});

router.get("/resources", (req, res) => {
  res.render("resources", { page: "static" });
});

module.exports = router;
