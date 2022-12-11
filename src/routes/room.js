import express from "express";
import mongoose from "mongoose";
import { createOrUpdateRoom } from "../controllers/roomController.js";
const roomRouter = express.Router();
import "../models/RoomSchema.js";
const Room = mongoose.model("rooms");

roomRouter.post("/add-room-data", async (req, res) => {
  try {
    const jsonResponse = await createOrUpdateRoom(req.body);

    res.json(jsonResponse);
  } catch (e) {
    res.json({ status: 404, message: "updating room failed" });
  }
});

roomRouter.post("/get-room-data", async (req, res) => {
  try {
    const respone = await Room.findOne({ roomid: req.body.roomId });

    res.json({
      message: "data fetched successfully",
      status: 200,
      data: respone,
    });
  } catch (e) {
    res.json({ status: 404, message: "fetching room failed" });
  }
});

export default roomRouter;
