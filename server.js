import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { mapUsersToRoom } from "./src/controllers/mapUsersToRoom.js";
import { checkValidMoves } from "./src/services/checkValidMove";

const app = express();
app.use(cors());

const server = http.createServer(app);

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
    // socket.to(data.roomid).emit("recieve_room_data", data);

    const {
      posOp,
      grabposOp,
      users,
      user,
      pieces,
      piecesOpponent,
      kingPos,
      kingPosOp,
      socket,
      myTurn,
      killedPieces,
      opponentKilledPieces,
      roomid,
    } = data;

    checkValidMoves(
      posOp,
      grabposOp,
      users,
      user,
      pieces,
      piecesOpponent,
      kingPos,
      kingPosOp,
      socket,
      myTurn,
      killedPieces,
      opponentKilledPieces,
      roomid
    );
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
