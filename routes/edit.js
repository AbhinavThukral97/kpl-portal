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
    School.findById(id)
      .then(doc => {
        User.find({ account: "Academic Head" }, ["name"], {
          sort: { account: 1 }
        })
          .then(AHList => {
            User.find({ account: "PR Manager" }, ["name"], {
              sort: { account: 1 }
            })
              .then(PRList => {
                res.render("editschool", {
                  AHList,
                  PRList,
                  doc
                });
              })
              .catch(err => {
                res.send(err);
              });
          })
          .catch(err => {
            res.send(err);
          });
      })
      .catch(err => {
        console.log(err);
        res.send(`${id} not found`);
      });
  } else {
    res.redirect("../../users/dashboard");
  }
});

router.post("/school/:id", ensureAuthenticated, (req, res) => {
  if (["Admin", "Academic Head", "CEO"].indexOf(req.user.account) > -1) {
    const id = req.params.id;
    const _id = id;
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
    if (!school || !area || !region || !AH || !PR) {
      const error = "Please fill in the required fields";
      const doc = {
        _id,
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
      };

      User.find({ account: "Academic Head" }, ["name"], {
        sort: { account: 1 }
      })
        .then(AHList => {
          User.find({ account: "PR Manager" }, ["name"], {
            sort: { account: 1 }
          })
            .then(PRList => {
              res.render("editschool", {
                AHList,
                PRList,
                doc,
                error
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
      const lastUpdate = Date.now();
      School.findByIdAndUpdate(id, {
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
        lastUpdate
      })
        .then(doc => {
          req.flash("success", `${doc.school} was successfully updated`);
          res.redirect("../../users/schools");
        })
        .catch(err => {
          res.send(err);
        });
    }
  } else {
    req.flash("error", "Access denied");
    res.redirect("../../users/dashboard");
  }
});

router.get("/report/:id", ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  Report.findById(id)
    .then(doc => {
      School.find({ deleted: false }, ["school"], { sort: { school: 1 } })
        .then(schoolList => {
          res.render("editreport", { doc, schoolList });
        })
        .catch(err => {
          res.send("Error fetching school list");
        });
    })
    .catch(err => {
      console.log(err);
      res.send(`${id} not found`);
    });
});

router.post("/report/:id", ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  const _id = id;
  let { school, visitType, purpose, followUpDate, final, remarks } = req.body;
  if (!remarks) {
    remarks = "";
  }
  if (!school || !visitType || !purpose) {
    const error = "Please fill in all the fields";
    const doc = {
      _id,
      school,
      visitType,
      purpose,
      followUpDate,
      final,
      remarks
    };
    School.find({ deleted: false }, ["school"], { sort: { school: 1 } })
      .then(schoolList => {
        res.render("editreport", {
          error,
          doc,
          schoolList
        });
      })
      .catch(err => {
        res.send("Error fetching school list");
      });
  } else {
    const lastUpdate = Date.now();
    School.findOne({ school: school })
      .then(schoolInfo => {
        const AH = schoolInfo.AH;
        const PR = schoolInfo.PR;
        const schoolType = schoolInfo.schoolType;
        Report.findByIdAndUpdate(id, {
          school,
          AH,
          PR,
          schoolType,
          visitType,
          purpose,
          followUpDate,
          final,
          remarks,
          lastUpdate
        })
          .then(doc => {
            req.flash(
              "success",
              `Report for ${doc.school} was successfully updated`
            );
            res.redirect("../../users/reports");
          })
          .catch(err => {
            res.send("Error editing document");
          });
      })
      .catch(err => {
        res.send("Error fetching school info");
      });
  }
});

module.exports = router;
