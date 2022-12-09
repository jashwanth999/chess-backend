import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { mapUsersToRoom } from "./src/controllers/mapUsersToRoom.js";
import mongoose from "mongoose";
import "./src/models/UserSchema.js";

const User = mongoose.model("users");

const app = express();
app.use(cors());

const server = http.createServer(app);

mongoose
  .connect("mongodb://localhost:27017/local", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log(Error, err.message);
  });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

var waitingUsers = [];

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    waitingUsers.push({ username: data.username, socket: socket });
    waitingUsers = mapUsersToRoom(waitingUsers);
  });

  socket.on("send_data", (data) => {
    socket.to(data.roomid).emit("recieve_room_data", data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.roomId).emit("recieve_chat_message", data);
  });

  socket.on("send_check_mate_data", (data) => {
    socket.to(data.roomId).emit("recieve_check_mate_data", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
app.post("/send", async (req, res) => {
  let user = new User({
    username: "jash",
  });

  
  await user.save();

  

  res.json({ user: user });
});
app.get("/", async (req, res) => {
  await User.find().then((result) => res.json({ post: result }));
  // res.send("api is running");
});

server.listen(process.env.PORT || 3001);
