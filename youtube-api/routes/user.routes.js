import express from "express";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    console.log("entering");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);

    const uploadImage = await cloudinary.uploader.upload(
      req.files.logoUrl.tempFilePath
    );
    console.log(uploadImage);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      channelName: req.body.channelName,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      logoUrl: uploadImage.secure_url,
      logoId: uploadImage.public_id,
    });
    let user = await newUser.save();
    console.log("user : ", user);
    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
