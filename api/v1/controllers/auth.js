const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "username + password required" });

  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ message: "username already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ username, passwordHash, cart: [] });

  return res.status(201).json({ message: "registered" });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "username + password required" });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "invalid credentials" });

  const token = jwt.sign(
    { uid: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.json({ token });
};