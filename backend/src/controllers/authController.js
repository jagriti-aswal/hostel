import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET || "jwtkey",
  { expiresIn: "1d" }
);

  res.json({
    token,
    role: user.role,
    email: user.email,
  });
};
