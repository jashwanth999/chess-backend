import mongoose from "mongoose";
const room = new mongoose.Schema({
  roomid: String,
  users: Array,
  pieces: Map,
  piecesOpponent: Map,
  turn: Boolean,
  killedPieces: Array,
  opponentKilledPieces: Array,
  time: Map,
  prevMovePos: Map,
  allPos: Array,
  allPosOp: Array,
});
export default mongoose.model("rooms", room);
