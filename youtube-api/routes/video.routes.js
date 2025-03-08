import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";

import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
dotenv.config();

router.post("/upload", checkAuth, async (req, res) => {
  try {
    const { title, category, description, tags } = req.body;

    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res
        .status(400)
        .json({ error: "Video and thumbnail are required" });
    }

    const videoUpload = await cloudinary.uploader.upload(
      req.files.video.tempFilePath,
      {
        resource_type: "video",
        folder: "videos",
      }
    );

    const thumbnailUpload = await cloudinary.uploader.upload(
      req.files.thumbnail.tempFilePath,
      {
        folder: "thumbnails",
      }
    );

    const newVideo = new Video({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      user_id: req.user_id,
      videoUrl: videoUpload.secure_url,
      videoId: videoUpload.public_id,
      thumbnailUrl: thumbnailUpload.secure_url,
      thumbnailId: thumbnailUpload.public_id,
      category,
      tags: tags ? tags.split(",") : [],
    });

    await newVideo.save();

    return res
      .status(201)
      .json({ message: "Video uploaded successfully", video: newVideo });
  } catch (error) {
    console.error("error in upload video : ", error);
    return res.status(500).json({ error: "Server error" });
  }
});

//only metadata change no video change

router.put("/update/:id", async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const videoId = req.body.id;

    const video = await Video.findbyId(videoId);
    if (!videoId) {
      return res.status(404).json({ message: "video not found" });
    }

    if (video.user_id.toString() !== req.user_id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.files && req.files.thumbnail) {
      await cloudinary.uploader.destroy(video.thumbnailId);

      const thumbnailUpload = await cloudinary.uploader.upload(
        req.files.thumbnail.tempFilePath,
        {
          folder: "thumbnail",
        }
      );

      video.thumbnailUrl = thumbnailUpload.secure_url;
      video.thumbnailId = thumbnailUpload.public_id;
    }

    //update fields
    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags ? tags.split(",") : video.tags;

    await video.save();
  } catch (error) {
    console.error("error in update video : ", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
