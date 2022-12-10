import mongoose from "mongoose";
const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
});
export default mongoose.model("users", user);
