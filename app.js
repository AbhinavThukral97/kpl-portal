const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 2244;

require("./config/passport")(passport);

//DB Config
const db = require("./config/keys").MongoURI;

//Connect
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => {
    console.log("MongoDB Connection Error", err);
  });

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Body Parser
app.use(express.urlencoded({ extended: false }));

//Session
app.use(
  session({
    secret: "kpl",
    resave: true,
    saveUninitialized: true
  })
);

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Public
app.use("/", express.static(__dirname + "/public"));
app.use("/users", express.static(__dirname + "/public"));
app.use("/delete", express.static(__dirname + "/public"));
app.use("/edit", express.static(__dirname + "/public"));
app.use("/info", express.static(__dirname + "/public"));
app.use("/recover", express.static(__dirname + "/public"));
app.use("/reset", express.static(__dirname + "/public"));
app.use("/download", express.static(__dirname + "/public"));

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/delete", require("./routes/delete"));
app.use("/edit", require("./routes/edit"));
app.use("/info", require("./routes/info"));
app.use("/recover", require("./routes/recover"));
app.use("/reset", require("./routes/reset"));
app.use("/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
