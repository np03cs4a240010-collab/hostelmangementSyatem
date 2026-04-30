const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    default: null
  },

  bookingStatus: {
    type: String,
    default: "Pending"
  },

  approvedBy: {
    type: String,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);