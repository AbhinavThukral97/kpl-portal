const express = require("express");

const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

//User Schema
const User = require("../models/User");

//Report Schema
const Report = require("../models/Report");

//School Schema
const School = require("../models/School");

router.get("/reports", ensureAuthenticated, (req, res) => {
  Report.find({ deleted: false })
    .then(allReports => {
      res.render("reportDownload", { allReports });
    })
    .catch(err => {
      res.send("Error Finding Resource");
    });
});

router.get("/myreports", ensureAuthenticated, (req, res) => {
  Report.find({ deleted: false, postedBy: req.user.name })
    .then(allReports => {
      res.render("reportDownload", { allReports });
    })
    .catch(err => {
      res.send("Error Finding Resource");
    });
});

router.get("/schools", ensureAuthenticated, (req, res) => {
  School.find({ deleted: false })
    .then(allSchools => {
      res.render("schoolDownload", { allSchools });
    })
    .catch(err => {
      res.send("Error Finding Resource");
    });
});

module.exports = router;
