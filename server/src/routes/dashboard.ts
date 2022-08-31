import express, { Request, Response } from "express";
import User from "../models/User";
import Member from "../models/Member";
import Sessions from "../models/Sessions";

const router = express.Router();

router.get("/userQuery", async (_: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    return res.sendStatus(403);
  }
});

router.get("/myRooms/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.sendStatus(403);
    }
    const rooms = await Member.find({ userId: req.params.id });
    return res.status(200).json(rooms);
  } catch (e) {
    return res.sendStatus(403);
  }
});
router.put("/offline", async (req: Request, res: Response) => {
  try {
    const userId = req.body._id;
    await User.findOneAndUpdate(
      { _id: String(userId) },
      { status: "offline" }
    ).lean();
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(401);
  }
});
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const userId = req.body._id;
    await Sessions.findOneAndUpdate(
      { userId: String(userId) },
      { valid: false }
    ).lean();
    res.cookie("acess_token", {expires: Date.now()});
    res.cookie("refresh_tokene", {expires: Date.now()});
    return res.sendStatus(201);
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
});

export default router;
