const express = require("express");

const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

//User Schema
const User = require("../models/User");

//Report Schema
const Report = require("../models/Report");

//School Schema
const School = require("../models/School");

router.get("/school/:id", ensureAuthenticated, (req, res) => {
  if (["Admin", "Academic Head", "CEO"].indexOf(req.user.account) > -1) {
    const id = req.params.id;
    School.findByIdAndUpdate(id, { deleted: true })
      .then(doc => {
        req.flash("success", `${doc.school} was moved to trash`);
        res.redirect("../../users/schools");
      })
      .catch(err => {
        res.send("Error Deleting Document");
      });
  } else {
    req.flash("error", "Access denied");
    res.redirect("../../users/dashboard");
  }
});

router.get("/report/:id", ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  Report.findByIdAndUpdate(id, { deleted: true })
    .then(doc => {
      req.flash("success", `Report for ${doc.school} was moved to trash`);
      res.redirect("../../users/reports");
    })
    .catch(err => {
      req.flash("error", "Error deleting document");
      res.redirect("../../users/reports");
    });
});

router.get("/account/:id", ensureAuthenticated, (req, res) => {
  if (req.user.account == "Admin") {
    const id = req.params.id;
    User.findByIdAndDelete(id)
      .then(doc => {
        req.flash("success", `Account for ${doc.username} was deleted`);
        res.redirect("../../users/accounts");
      })
      .catch(err => {
        res.send("Error Deleting Document");
      });
  } else {
    req.flash("error", "Admin access required to perform this task");
    res.redirect("../../users/dashboard");
  }
});

router.get("/trash", ensureAuthenticated, (req, res) => {
  if (["Admin", "CEO"].indexOf(req.user.account) > -1) {
    Report.deleteMany({ deleted: true })
      .then(reports => {
        School.deleteMany({ deleted: true })
          .then(schools => {
            req.flash("success", `Trash Emptied`);
            res.redirect("../../users/trash");
          })
          .catch(errSchool => {
            res.send("Error Deleting School Data");
          });
      })
      .catch(errReport => {
        res.send("Error Deleting Report Data");
      });
  } else {
    req.flash("error", "Access denied");
    res.redirect("../../users/dashboard");
  }
});

module.exports = router;
