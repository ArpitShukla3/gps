import jwt from "jsonwebtoken";
import User from "../schema/User.js";
import dotenv from "dotenv";
dotenv.config();
export default async function authMiddleware(req, res, next) {
  try {
    // const token = req.cookies.token;
    const authHeader = req.headers.authorization;
    // console.log("authHeader", authHeader);
    if (!authHeader) {
      res.send({ message: "Inavlid token", token });
    }
    const token = authHeader.split(" ")[1]; // Extract token if it follows "Bearer <token>" format
    if (!token) {
      return res
        .status(401)
        .send({ error: "Access denied. No token provided." });
    }
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(token);
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error", error.message);
    res.status(401).send({ error: "Invalid token." }, error.message);
  }
}
