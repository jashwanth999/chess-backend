import mongoose from "mongoose";
import "../models/RoomSchema.js";
const Room = mongoose.model("rooms");

export const createOrUpdateRoom = async (data) => {
  const existingRoom = await Room.findOne({ roomid: data.roomid });

  if (existingRoom) {
    try {
      const existingRoom = await Room.findOneAndUpdate(
        { roomid: data.roomid },
        {
          roomid: data.roomid,
          users: data.users,
          pieces: data.pieces,
          piecesOpponent: data.piecesOpponent,
          turn: data.turn,
          killedPieces: data.killedPieces,
          opponentKilledPieces: data.opponentKilledPieces,
          time: data.time,
          prevMovePos: data.prevMovePos,
          allPos: data.allPos,
          allPosOp: data.allPosOp,
        },
        { new: true }
      );
      return {
        message: "room updated successfully",
        status: 200,
        data: existingRoom,
      };
    } catch (e) {
      return {
        message: "finding room failed",
        status: 400,
      };
    }
  }
  const newRoom = new Room({
    roomid: data.roomid,
    users: [],
    pieces: data.pieces,
    piecesOpponent: data.piecesOpponent,
    turn: data.turn,
    killedPieces: data.killedPieces,
    opponentKilledPieces: data.opponentKilledPieces,
    time: data.time,
    prevMovePos: data.prevMovePos,
    allPos: data.allPos,
  });

  await newRoom.save();

  return {
    message: "room created successfully",
    status: 200,
    data: newRoom,
  };
};
