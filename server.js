import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { mapUsersToRoom } from "./src/controllers/mapUsersToRoom.js";
import { dropValidMove } from "./src/controllers/checkValidMove.js";
import {
  isValidMoveForCheckMate,
  pieceValidMethodMap,
} from "./src/controllers/validMoveService.js";
import { callingOpponentForCheckMate } from "./src/controllers/checkMateService.js";

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
      myTurn,
      killedPieces,
      opponentKilledPieces,
      roomid,
    } = data;

    console.log(data);
    dropValidMove(
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

  socket.on("check_valid_move", (data) => {
    const { prevX, prevY, x, y, pieceName, pieces } = data;

    const isValid = pieceValidMethodMap(prevX, prevY, x, y, pieceName, pieces);

    socket.emit("valid_move", isValid);
  });

  socket.on("check_for_valid_move_check", (data) => {
    const { kingPosX, kingPosY, pieces } = data;

    const isValidMoveCheckMate = isValidMoveForCheckMate(
      kingPosX,
      kingPosY,
      pieces
    );

    socket.emit("send_valid_move_check", {
      isValidMoveCheckMate: isValidMoveCheckMate,
    });
  });

  socket.on("check_our_move_is_called_for_check_for_opponent", (data) => {
    const { kingPosX, kingPosY, x, y, pieceName, pieces } = data;
    const isOurMoveCalledForOpponetCheck = callingOpponentForCheckMate(
      kingPosX,
      kingPosY,
      x,
      y,
      pieceName,
      pieces
    );

    socket.emit("send_our_move_called_opponent_for_check_mata", {
      isOurMoveCalledForOpponetCheck: isOurMoveCalledForOpponetCheck,
    });
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
