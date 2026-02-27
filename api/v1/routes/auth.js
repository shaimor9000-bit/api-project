const router = require("express").Router();
// Create an Express router

const bcrypt = require("bcrypt");
// For hashing and comparing passwords

const jwt = require("jsonwebtoken");
// For creating JWT tokens

const User = require("../models/user");
// Import User model


router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Get username and password from request

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }
    // Make sure both fields exist

    const existing = await User.findOne({ username });
    // Check if username already exists

    if (existing) {
      return res.status(409).json({ message: "username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Hash the password (10 salt rounds)

    await User.create({ username, passwordHash });
    // Save new user to DB

    return res.status(201).json({ message: "registered" });
    // Success response
  } catch (err) {
    return res.status(500).json({ message: "register failed", error: err.message });
    // Server error
  }
});


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Get login data

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const user = await User.findOne({ username });
    // Find user in DB

    if (!user) return res.status(401).json({ message: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    // Compare entered password with stored hash

    if (!ok) return res.status(401).json({ message: "invalid credentials" });

    const token = jwt.sign(
      { id: String(user._id), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    // Create JWT token (valid 2 hours)

    return res.status(200).json({ token });
    // Send token to client
  } catch (err) {
    return res.status(500).json({ message: "login failed", error: err.message });
  }
});


module.exports = router;
// Export router