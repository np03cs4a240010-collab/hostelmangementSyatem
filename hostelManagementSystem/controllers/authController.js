const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Wrong email
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password."
      });
    }

    // Wrong password
    if (user.password !== password) {
      return res.status(400).json({
        message: "Incorrect email or password."
      });
    }

    // SUCCESS LOGIN
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};