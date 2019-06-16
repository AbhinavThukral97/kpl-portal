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
  Report.findByIdAndUpdate(id, { deleted: false })
    .then(doc => {
      req.flash("success", `${doc.school} was recovered from trash.`);
      res.redirect("../../users/trash");
    })
    .catch(err => {
      res.send("Error Recovering Resource");
    });
});

router.get("/school/:id", ensureAuthenticated, (req, res) => {
  if (req.user.account == "Admin") {
    const id = req.params.id;
    School.findByIdAndUpdate(id, { deleted: false })
      .then(doc => {
        req.flash("success", `${doc.school} was recovered from trash.`);
        res.redirect("../../users/trash");
      })
      .catch(err => {
        res.send("Error Recovering Resource");
      });
  } else {
    res.redirect("../../users/dashboard");
  }
});

module.exports = router;
