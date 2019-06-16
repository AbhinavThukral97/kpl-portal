const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
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
  area: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  schoolType: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: Number
  },
  principal: {
    type: String
  },
  POC: {
    type: String
  },
  POCEmail: {
    type: String
  },
  POCPhone: {
    type: Number
  },
  dealer: {
    type: String
  },
  dealerEmail: {
    type: String
  },
  dealerPhone: {
    type: Number
  },
  info: {
    type: String
  },
  postedBy: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("school", SchoolSchema);
