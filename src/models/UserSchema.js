import mongoose from "mongoose";
const user = new mongoose.Schema({
  username: String,
  password: String,
  isInGame: Boolean,
  activeGameRoomId: String,
});
export default mongoose.model("users", user);
