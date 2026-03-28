const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: String,
  phone: Number,
  email: String,
  permanentAddress: String,
  temporaryAddress: String,
  dateOfBirth: Date,
  educationStatus: String,
  roomNumber: Number,
  moveInStatus: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Student", studentSchema);