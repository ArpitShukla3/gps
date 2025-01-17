import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./connect/dbConnect.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT;

// Create HTTP server
const server = http.createServer(app);
app.use(cors({
  origin: [ 'http://localhost:5173', 'https://gps-front-1.onrender.com',"https://4858-117-250-157-213.ngrok-free.app"],
  //   addd your ip:5173 here for local testing
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.get("/hello-world", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hello World</title>
    </head>
    <body>
      <h1>Hello World!</h1>
    </body>
    </html>
  `);
  res.send("Hello World!");
});


// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://gps-front-1.onrender.com","https://4858-117-250-157-213.ngrok-free.app"],
    credentials: true
  }
});
//  no slash
app.use("/", authRouter);


io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
  });

  socket.on("join room", (data) => {
    socket.join(data);
    // console.log("User joined room:", data);

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
  // console.log("Cleaning up resources...");

  // // Close the database connection
  // mongoose.connection.close(false, () => {
  //   // console.log("MongoDB connection closed.");
  // });

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
