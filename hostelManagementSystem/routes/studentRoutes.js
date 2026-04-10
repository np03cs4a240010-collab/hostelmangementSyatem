const express = require("express");
const router = express.Router();

const {
  approveStudent,
  rejectStudent,
  getAllBookings
} = require("../controllers/studentController");

router.get("/bookings", getAllBookings);
router.put("/approve/:id", approveStudent);
router.put("/reject/:id", rejectStudent);

module.exports = router;