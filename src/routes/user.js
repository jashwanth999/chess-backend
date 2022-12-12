import express from "express";
import mongoose from "mongoose";
import { updateUser } from "../controllers/userController.js";
const userRouter = express.Router();
import "../models/UserSchema.js";
const User = mongoose.model("users");

userRouter.post("/signup", async (req, res) => {
  const { username, password } = await req.body;

  try {
    if (!username || !password) {
      return res.json({ message: "Please fill all details", status: 104 });
    }
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.json({
        message: "username already taken",
        stauts: 101,
      });
    }
    const user = new User({
      username: username,
      password: password,
    });

    await user.save();

    return res.json({
      message: "registered successfully",
      user: user,
      status: 200,
    });
  } catch (e) {
    console.log("Error while creating user", e.message);
    return res.json({
      message: e.message,
      status: 400,
    });
  }
});
userRouter.post("/login", async (req, res) => {
  const { username, password } = await req.body;
  try {
    const existingUser = await User.findOne({ username: username });

    if (!existingUser) {
      return res.json({
        message: "Invalid username",
        stauts: 102,
      });
    }

    if (existingUser.password === password) {
      return res.json({
        user: existingUser,
        status: 200,
        message: "login successfull",
      });
    } else {
      return res.json({
        status: 103,
        message: "Invalid password",
      });
    }
  } catch (e) {
    return res.json({
      message: e.message,
      status: 400,
    });
  }
});

userRouter.post("/get-user", async (req, res) => {
  const { _id } = await req.body;
  try {
    const existingUser = await User.findOne({ _id: _id });

    res.json({
      message: "user details fetch successfully",
      user: existingUser,
      status: 200,
    });
  } catch (e) {
    return res.json({
      message: e.message,
      status: 400,
    });
  }
});

userRouter.post("/update-user", async (req, res) => {
  try {
    
    updateUser(req.body);

    res.json({ message: "message updated successfully", status: 200 });
  } catch (e) {
    res.json({ message: e.message, status: 400 });
  }
});

export default userRouter;
