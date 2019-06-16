const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const { ensureAuthenticated } = require("../config/auth");

//User Schema
const User = require("../models/User");

//Report Schema
const Report = require("../models/Report");

//School Schema
const School = require("../models/School");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", ensureAuthenticated, (req, res) => {
  if (req.user.account == "Admin") {
    res.render("register");
  } else {
    req.flash("error", "Admin authorization required to perform this task");
    res.redirect("dashboard");
  }
});

router.post("/register", ensureAuthenticated, (req, res) => {
  const { name, username, password, account } = req.body;
  let errors = [];
  if (!name || !username || !password || !account) {
    errors.push({ msg: "Please fill in all the fields" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      username,
      account
    });
  } else {
    User.findOne({ username: username }).then(user => {
      if (user) {
        errors.push({ msg: "Username already exists" });
        res.render("register", {
          errors,
          name,
          username,
          account
        });
      } else {
        const newUser = new User({
          name,
          username,
          password,
          account
        });

        //Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash("success", "Registration Successful");
                res.redirect("register");
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
      }
    });
  }
});

router.post("/changepassword", ensureAuthenticated, (req, res) => {
  const { oldpassword, newpassword, confirmpassword } = req.body;
  let errors = [];
  if (!oldpassword || !newpassword || !confirmpassword) {
    errors.push({ msg: "Please fill the required fields" });
  }
  if (newpassword != confirmpassword) {
    errors.push({ msg: "Confirmed password does not match" });
  }
  if (newpassword == confirmpassword && newpassword.length < 6) {
    errors.push({ msg: "Password must be 6 characters long" });
  }
  if (errors.length > 0) {
    res.render("profile", { user: req.user, errors });
  } else {
    User.findOne({ username: req.user.username })
      .then(user => {
        bcrypt.compare(oldpassword, user.password, (err, isMatch) => {
          if (err) {
            throw err;
          }

          if (isMatch) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newpassword, salt, (err, hash) => {
                if (err) {
                  throw err;
                }
                const newPass = hash;
                User.findOneAndUpdate(
                  { username: user.username },
                  { password: newPass }
                )
                  .then(doc => {
                    req.flash("success", "Password changed successfully");
                    res.redirect("profile");
                  })
                  .catch(err => {
                    console.log(err);
                    res.send("Error updating password");
                  });
              });
            });
          } else {
            req.flash("error", "Incorrect Old Password");
            res.redirect("profile");
          }
        });
      })
      .catch(err => {
        res.send("Error fetching user details");
      });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "dashboard",
    failureRedirect: "login",
    failureFlash: true
  })(req, res, next);
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user
  });
});

router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    user: req.user
  });
});

router.get("/reports", ensureAuthenticated, (req, res) => {
  let { sortBy, order } = req.query;
  if (!sortBy) {
    sortBy = "lastUpdate";
    order = -1;
  }
  if (["PR Manager", "Employee"].indexOf(req.user.account) > -1) {
    Report.find({
      $and: [
        { deleted: false },
        {
          $or: [
            { reporterAccountType: "PR Manager" },
            { reporterAccountType: "Employee" }
          ]
        }
      ]
    })
      .sort([[sortBy, order]])
      .then(allReports => {
        res.render("reports", {
          user: req.user,
          allReports
        });
      })
      .catch(err => {
        res.send("Error finding reports");
      });
  } else {
    Report.find({ deleted: false })
      .sort([[sortBy, order]])
      .then(allReports => {
        res.render("reports", {
          user: req.user,
          allReports
        });
      })
      .catch(err => {
        res.send("Error finding reports");
      });
  }
});

router.get("/myreports", ensureAuthenticated, (req, res) => {
  let { sortBy, order } = req.query;
  if (!sortBy) {
    sortBy = "lastUpdate";
    order = -1;
  }
  Report.find({ deleted: false, postedBy: req.user.name })
    .sort([[sortBy, order]])
    .then(allReports => {
      res.render("myreports", {
        user: req.user,
        allReports
      });
    })
    .catch(err => {
      res.send("Error finding reports");
    });
});

router.get("/newreport", ensureAuthenticated, (req, res) => {
  School.find({ deleted: false }, ["school"], { sort: { school: 1 } })
    .then(schoolList => {
      res.render("newreport", {
        user: req.user,
        schoolList
      });
    })
    .catch(err => {
      res.send("Error fetching school list");
    });
});

router.post("/newreport", ensureAuthenticated, (req, res) => {
  let { school, visitType, purpose, followUpDate, final, remarks } = req.body;
  if (!remarks) {
    remarks = "";
  }
  if (!school || !visitType || !purpose) {
    const error = "Please fill in all the fields";
    School.find({ deleted: false }, ["school"], { sort: { school: 1 } })
      .then(schoolList => {
        console.log(schoolList);
        res.render("newreport", {
          error,
          school,
          visitType,
          purpose,
          followUpDate,
          final,
          remarks,
          schoolList
        });
      })
      .catch(err => {
        res.send("Error in fetching school list");
      });
  } else {
    School.findOne({ school: school })
      .then(schoolInfo => {
        const postedBy = req.user.name;
        const AH = schoolInfo.AH;
        const PR = schoolInfo.PR;
        const schoolType = schoolInfo.schoolType;
        const reporterAccountType = req.user.account;
        const NewReport = new Report({
          school,
          AH,
          PR,
          schoolType,
          visitType,
          purpose,
          followUpDate,
          final,
          remarks,
          postedBy,
          reporterAccountType
        });
        NewReport.save()
          .then(report => {
            req.flash(
              "success",
              `Report for ${report.school} successfully added`
            );
            res.redirect("reports");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        res.send("Error finding school info");
      });
  }
});

router.get("/newschool", ensureAuthenticated, (req, res) => {
  User.find({ account: "Academic Head" }, ["name"], { sort: { account: 1 } })
    .then(AHList => {
      User.find({ account: "PR Manager" }, ["name"], { sort: { account: 1 } })
        .then(PRList => {
          res.render("newschool", {
            user: req.user,
            AHList,
            PRList
          });
        })
        .catch(err => {
          res.send(err);
        });
    })
    .catch(err => {
      res.send(err);
    });
});

router.post("/newschool", ensureAuthenticated, (req, res) => {
  let {
    school,
    AH,
    PR,
    area,
    region,
    schoolType,
    website,
    email,
    phone,
    principal,
    POC,
    POCEmail,
    POCPhone,
    dealer,
    dealerEmail,
    dealerPhone,
    info
  } = req.body;
  if (!school || !AH || !PR || !area || !region) {
    const error = "Please fill in the required fields";
    User.find({ account: "Academic Head" }, ["name"], {
      sort: { account: 1 }
    })
      .then(AHList => {
        User.find({ account: "PR Manager" }, ["name"], {
          sort: { account: 1 }
        })
          .then(PRList => {
            res.render("newschool", {
              error,
              school,
              area,
              region,
              schoolType,
              website,
              email,
              phone,
              principal,
              POC,
              POCEmail,
              POCPhone,
              dealer,
              dealerEmail,
              dealerPhone,
              info,
              AHList,
              PRList
            });
          })
          .catch(err => {
            res.send(err);
          });
      })
      .catch(err => {
        res.send(err);
      });
  } else {
    const postedBy = req.user.name;
    const NewSchool = new School({
      school,
      AH,
      PR,
      area,
      region,
      schoolType,
      website,
      email,
      phone,
      principal,
      POC,
      POCEmail,
      POCPhone,
      dealer,
      dealerEmail,
      dealerPhone,
      info,
      postedBy
    });
    NewSchool.save()
      .then(school => {
        req.flash("success", "School Successfully Added");
        res.redirect("schools");
      })
      .catch(err => {
        res.send(err);
      });
  }
});

router.get("/schools", ensureAuthenticated, (req, res) => {
  let { sortBy, order } = req.query;
  if (!sortBy) {
    sortBy = "lastUpdate";
    order = -1;
  }
  School.find({ deleted: false })
    .sort([[sortBy, order]])
    .then(allSchools => {
      res.render("schools", {
        user: req.user,
        allSchools
      });
    })
    .catch(err => {
      const allSchools = [];
      console.log(err);
      res.render("schools", {
        user: req.user,
        allSchools
      });
    });
});

router.get("/accounts", ensureAuthenticated, (req, res) => {
  if (["Admin", "CEO"].indexOf(req.user.account) > -1) {
    User.find({})
      .then(allUsers => {
        res.render("accounts", {
          user: req.user,
          allUsers
        });
      })
      .catch(err => {
        const allUsers = [];
        console.log(err);
        res.render("accounts", {
          user: req.user,
          allUsers
        });
      });
  } else {
    req.flash("error", "Access denied");
    res.redirect("dashboard");
  }
});

router.get("/trash", ensureAuthenticated, (req, res) => {
  if (["Admin", "CEO"].indexOf(req.user.account) > -1) {
    Report.find({ deleted: true })
      .then(deletedReports => {
        School.find({ deleted: true })
          .then(deletedSchools => {
            res.render("trash", {
              user: req.user,
              deletedReports,
              deletedSchools
            });
          })
          .catch(err => {
            res.send("Error Fetching Deleted Schools");
          });
      })
      .catch(err => {
        res.send("Error Fetching Deleted Reports");
      });
  } else {
    req.flash("error", "Access denied");
    res.redirect("dashboard");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("login");
});

module.exports = router;
