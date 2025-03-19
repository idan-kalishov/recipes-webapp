import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import userModel, { IUser } from "../models/User";

// Update user details (including profile picture)
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as IUser)?._id;
    const { userName } = req.body;
    const file = req.file;

    if (!userId) {
      res.status(400).json({ message: "Invalid request: User ID is missing" });
      return;
    }

    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (userName) user.userName = userName;

    if (file) {
      if (user.profilePicture) {
        const oldFilePath = path.join(__dirname, "../", user.profilePicture);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      user.profilePicture = `uploads/${file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { updateUser };
