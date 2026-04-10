const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    // Room reference
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    // Booking Status
    bookingStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },

    // Who approved/rejected
    approvedBy: {
      type: String, // "Owner" or "Warden"
      default: null
    }
  },
  {
    timestamps: true // createdAt, updatedAt (useful for frontend)
  }
);

module.exports = mongoose.model("Student", studentSchema);