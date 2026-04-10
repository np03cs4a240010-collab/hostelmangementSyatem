const Student = require("../models/Student");
const Room = require("../models/Room");

// ================= VIEW ALL STUDENTS =================
exports.getStudents = async (req, res) => {
  const students = await Student.find().populate("room");
  res.json(students);
};

// ================= ADD STUDENT (BOOK ROOM) =================
exports.addStudent = async (req, res) => {
  try {
    const { email } = req.body;

    // CHECK DUPLICATE BOOKING (MAIN REQUIREMENT)
    const existing = await Student.findOne({
      email: email,
      bookingStatus: { $in: ["Pending", "Approved"] }
    });

    //  BLOCK IF ALREADY EXISTS
    if (existing) {
      return res.status(400).json({
        message: "A booking request from this email address already exists."
      });
    }

    //  ALLOW IF NO CONFLICT OR PREVIOUS WAS REJECTED
    const student = new Student(req.body);

    student.bookingStatus = "Pending"; // default status

    await student.save();

    res.json({
      message: "Booking request submitted successfully",
      student
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= EDIT STUDENT =================
exports.updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// ================= DELETE STUDENT =================
exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};

// ================= GET ALL BOOKINGS (OWNER DASHBOARD) =================
exports.getAllBookings = async (req, res) => {
  try {
    const students = await Student.find().populate("room");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= APPROVE BOOKING =================
exports.approveStudent = async (req, res) => {
  try {
    const { role } = req.body; // "Owner" or "Warden"

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    //  Already handled (disable button in frontend)
    if (student.bookingStatus !== "Pending") {
      return res.json({
        message: `Already actioned by ${student.approvedBy}`
      });
    }

    const room = await Room.findById(student.room);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    //  prevent overbooking
    if (room.occupiedSeats >= room.totalSeats) {
      return res.json({ message: "Room is Full" });
    }

    //  APPROVE STUDENT
    student.bookingStatus = "Approved";
    student.approvedBy = role;
    await student.save();

    //  UPDATE ROOM (MAIN REQUIREMENT)
    room.occupiedSeats += 1;
    room.seatsLeft = room.totalSeats - room.occupiedSeats;

    room.status =
      room.occupiedSeats === room.totalSeats ? "Full" : "Available";

    await room.save();

    res.json({
      message: `Approved by ${role}`,
      student,
      room
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= REJECT BOOKING =================
exports.rejectStudent = async (req, res) => {
  try {
    const { role } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    //  Already handled
    if (student.bookingStatus !== "Pending") {
      return res.json({
        message: `Already actioned by ${student.approvedBy}`
      });
    }

    //  REJECT STUDENT
    student.bookingStatus = "Rejected";
    student.approvedBy = role;

    await student.save();

    res.json({
      message: `Rejected by ${role}`,
      student
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};