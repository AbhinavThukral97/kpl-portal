const express = require("express");

const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

//User Schema
const User = require("../models/User");

//Report Schema
const Report = require("../models/Report");

//School Schema
const School = require("../models/School");

router.get("/report/:id", ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  Report.findById(id)
    .then(doc => {
      res.render("inforeport", { doc });
    })
    .catch(err => {
      res.send("Error Finding Resource");
    });
});

router.get("/school/:id", ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  School.findById(id)
    .then(doc => {
      res.render("infoschool", { doc });
    })
    .catch(err => {
      res.send("Error Finding Resource");
    });
});

module.exports = router;
