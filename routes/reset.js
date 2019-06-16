const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

//User Schema
const User = require("../models/User");

router.get("/:id", ensureAuthenticated, (req, res) => {
  if (req.user.account == "Admin") {
    const id = req.params.id;
    User.findById(id)
      .then(doc => {
        res.render("reset", { doc });
      })
      .catch(err => {
        res.send(err);
      });
  } else {
    res.redirect("../users/dashboard");
  }
});

router.post("/:id", ensureAuthenticated, (req, res) => {
  if (req.user.account == "Admin") {
    const id = req.params.id;
    const { newpassword } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newpassword, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        const newPass = hash;
        User.findByIdAndUpdate(id, { password: newPass })
          .then(doc => {
            req.flash("success", "Password reset successfully");
            res.redirect("../users/accounts");
          })
          .catch(err => {
            console.log(err);
            res.send("Error updating password");
          });
      });
    });
  } else {
    res.redirect("../users/dashboard");
  }
});

module.exports = router;
