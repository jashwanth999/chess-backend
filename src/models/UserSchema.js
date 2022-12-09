import mongoose from "mongoose";
const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});
export default mongoose.model("users", user);
