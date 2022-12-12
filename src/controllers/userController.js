import mongoose from "mongoose";
import "../models/UserSchema.js";
const User = mongoose.model("users");

export const updateUser = async (data) => {
  const { _id, isInGame, roomId } = data;

  await User.findOneAndUpdate(
    { _id: _id },
    {
      isInGame: isInGame,
      activeGameRoomId: roomId,
    },
    { new: true }
  );
};
