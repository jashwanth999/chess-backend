const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);
//https://chess-frontend.netlify.app

const io = new Server(server, {
  cors: {
    origin: "https://chess-frontend.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

var roomIDTOUsers = {};

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data.roomId);

    if (!roomIDTOUsers[data.roomId]) roomIDTOUsers[data.roomId] = [];

    roomIDTOUsers[data.roomId].push(data);
  });

  socket.on("get_data_room", (data) => {
    socket.emit("recieve_users_to_room", roomIDTOUsers[data.roomid]);
  });

  socket.on("send_data", (data) => {
    // console.log(data);
    socket.to(data.roomid).emit("recieve_room_data", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
app.get("/", (req, res) => {
  res.send("GET Request Called");
});

server.listen(process.env.PORT || 3001);

// server.listen(3001, () => {
//   console.log("server is running");
// });
