import { Request, Response } from "express";
import { hashSync, compareSync } from "bcrypt";
import User, { UserDocument } from "../models/user.model";
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserDocument;
    const userInfo = await User.findById(user._id).exec();

    if (!userInfo) {
      return res.status(200).json({ message: "User not found" });
    }

    const userObject = userInfo.toObject(); // Convert the Mongoose document to a plain JavaScript object

    return res.status(200).json({
      _id: userObject._id,
      first_name: userObject.first_name,
      last_name: userObject.last_name,
      email: userObject.email,
      phone_number: userObject.phone_number,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserDocument;
    const { first_name, last_name, email, phone_number } = req.body;

    // Find and update the user by ID
    const updatedUserInfo = await User.findByIdAndUpdate(
      user._id,
      {
        first_name,
        last_name,
        email,
        phone_number,
      },
      {
        new: true,
        projection: {
          _id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone_number: true,
        },
      }
    ).exec();

    if (!updatedUserInfo) {
      return res.status(200).json({ message: "User not found" });
    }

    console.log("Before update:", updatedUserInfo);
    console.log("After update:", req.body);

    // Compare values directly
    const hasUpdates =
      JSON.stringify(updatedUserInfo) !== JSON.stringify(req.body);

    if (hasUpdates) {
      return res.status(200).json({
        message: "User information updated successfully",
        updatedUserInfo,
      });
    } else {
      return res
        .status(200)
        .json({ message: "No updates were made to user information" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserDocument;
    const { currentPassword, newPassword } = req.body;

    // Find the user by their ID
    const userInfo = await User.findById(user._id);

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    if (compareSync(currentPassword, userInfo.password)) {
      // Update the password and save the user document
      userInfo.password = hashSync(newPassword, 10);
      await userInfo.save();

      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res.status(403).json({ message: "Current password is incorrect" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", details: error });
  }
};
