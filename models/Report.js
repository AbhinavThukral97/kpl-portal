const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true
  },
  AH: {
    type: String,
    required: true
  },
  PR: {
    type: String,
    required: true
  },
  schoolType: {
    type: String
  },
  visitType: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  followUpDate: {
    type: String
  },
  final: {
    type: String
  },
  remarks: {
    type: String
  },
  postedBy: {
    type: String,
    required: true
  },
  reporterAccountType: {
    type: String,
    required: true
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("report", ReportSchema);
