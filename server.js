const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  let allData = [];

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_data", (data) => {
    // console.log(data);
    socket.to(data.roomid).emit("recieve_room_data", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
server.listen(3001, () => {
  console.log("server is running");
});