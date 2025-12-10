import User from "../models/User.js";
import jwt from "jsonwebtoken";

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = signToken(user);
  res
    .status(201)
    .json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });
  res.json({
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email },
  });
};
