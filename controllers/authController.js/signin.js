import bcrypt from "bcryptjs";
import User from "../../schema/User.js";
import jwt from "jsonwebtoken";
export default async function Signin(req, res) {
  try {
    const { email, password } = req.body;

    // Log the received email and password
    const user = await User.findOne({ email });
    if (!user || !email) {
      return res.status(404).send({ error: "User not found" });
    }

    // Log the user details from the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      sameSite: 'Lax',
    });

    // Send a success response with the user details (excluding password)
    res.status(201).send({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send({ error: "Internal server error", message: error.message });
  }
}