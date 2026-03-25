const Student = require("../models/Student");

// VIEW
exports.getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

// ADD
exports.addStudent = async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json(student);
};

// EDIT
exports.updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// DELETE
exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};