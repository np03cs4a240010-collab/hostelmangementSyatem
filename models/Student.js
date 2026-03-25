const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  permanentAddress: String,
  temporaryAddress: String,
  dateOfBirth: Date,
  educationStatus: String,
  roomNumber: String,
  moveInStatus: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Student", studentSchema);