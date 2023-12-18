import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import UserAddress from "../models/userAddress.model";

export const getUserAddressesByUserId = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken: any = jwt.verify(token, "top-secret");
    let addresses = await UserAddress.find({ user_id: decodedToken._id });
    return res.status(201).json(addresses);
  } catch (err) {
    console.log("Error in getting User Address by Id", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err });
  }
};

export const createNewUserAddress = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken: any = jwt.verify(token, "top-secret");
    // Check if the address already exists for this user
    let existingAddress = await UserAddress.findOne({
      user_id: decodedToken._id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      email: req.body.email,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      pin_code: req.body.pin_code,
    });
    if (!existingAddress) {
      let newAddress = await UserAddress.create({
        user_id: decodedToken._id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        pin_code: req.body.pin_code,
      });
      return res.status(201).json(newAddress);
    } else {
      return res
        .status(409)
        .send("This address is already associated with another account");
    }
  } catch (error) {
    console.log("Error in creating a new User Address", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error });
  }
};

// Update an existing address
// export const updateExistingUserAddress = async (req: Request, res: Response) => {
//   try {
//     let updatedAddress = await userAddress.update(req.body, { where: { id: req.params.addressId }});
//     return res.status(201).json(updatedAddress[0]);
//   } catch (err) {
//     console.log('Error in updating User Address', err);
//     return res.status(500).send();
//     }
//     };

// // Delete an existing address
// export const deleteExistingUserAddress = async (req: Request, res: Response) => {
//     try {
//     let deletedAddress = await userAddress.destroy({ where: { id: req.params.addressId }});
//     return res.status(201).json(deletedAddress);
// } catch (err) {
//     console.log('Error in deleting User Address', err);
//     return res.status(500).send();
//     }
//     };
