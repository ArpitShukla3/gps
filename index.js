import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./connect/dbConnect.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT;

// Create HTTP server
const server = http.createServer(app);

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", authRouter);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("join room", (data) => {
    socket.join(data);
    console.log("User joined room:", data);

    socket.on("location update", (payload) => {
      const rooms = payload.To;
      rooms.forEach((room) => {
        socket.to(room._id).emit("location update", payload);
      });
    });
  });
});

// Server cleanup function
function cleanup() {
  console.log("Cleaning up resources...");

  // Close the database connection
  mongoose.connection.close(false, () => {
    console.log("MongoDB connection closed.");
  });

  // Disconnect all connected sockets
  io.sockets.sockets.forEach((socket) => {
    socket.disconnect(true);
  });

  // Close the HTTP server
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
}

// Handle process termination signals
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
