const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chess-frontend.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

var waitingUsers = [];

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    if (waitingUsers.length >= 1) {
      let user1 = waitingUsers.pop();

      let user2 = { username: data.username, socket: socket };

      let roomId = user1.socket.id + "-" + user2.socket.id;

      user1.socket.join(roomId);

      user2.socket.join(roomId);

      let users = [
        { username: user1.username, roomId: roomId, color: "b" },
        { username: user2.username, roomId: roomId, color: "w" },
      ];

      user1.socket.to(roomId).emit("recieve_room_users", users);

      user2.socket.to(roomId).emit("recieve_room_users", users);
    } else {
      waitingUsers.push({ username: data.username, socket: socket });
    }
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
app.get("/", (req, res) => {
  res.send("api is running");
});

server.listen(process.env.PORT || 3001);
