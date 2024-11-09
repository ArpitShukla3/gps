import User from "../../schema/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createCookieOptions } from "../../utils.js";
dotenv.config();
export default async function Signup(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "User already exists" });
    }
    // Create a new user
    const user = new User({
      name,
      email,
      password: password,
    });
    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    // Set the token in a cookie
    res.cookie("token", token, createCookieOptions);

    // Send a success response with the user details (excluding password)
    res.status(201).send({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authToken: token,
      },
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Internal server error", message: error.message });
  }
}
