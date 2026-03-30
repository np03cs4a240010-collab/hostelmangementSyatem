const Student = require("../models/Student");
const Room = require("../models/Room");

// ================= VIEW =================
exports.getStudents = async (req, res) => {
  const students = await Student.find().populate("room");
  res.json(students);
};

// ================= ADD =================
exports.addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);

    // default booking status
    student.bookingStatus = "Pending";

    await student.save();
    res.json(student);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= EDIT =================
exports.updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// ================= DELETE =================
exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};

// ================= APPROVE BOOKING =================
exports.approveStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // already approved check
    if (student.bookingStatus === "Approved") {
      return res.json({ message: "Already approved" });
    }

    // find room
    const room = await Room.findById(student.room);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // ❌ prevent overbooking
    if (room.occupiedSeats >= room.totalSeats) {
      return res.json({ message: "Room is already full" });
    }

    // ✅ approve student
    student.bookingStatus = "Approved";
    await student.save();

    // ✅ update room
    room.occupiedSeats += 1;

    // 🔥 MAIN LOGIC (your requirement)
    room.seatsLeft = room.totalSeats - room.occupiedSeats;

    if (room.seatsLeft === 0) {
      room.status = "Full";
    } else {
      room.status = "Available";
    }

    await room.save();

    res.json({
      message: "Student approved & room updated",
      room
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};