// import db from "../models";
// const Brand = db.brand;
import { Request, Response } from "express";
import Brand from "../models/brands.model";

export const showBrands = async (req: Request, res: Response) => {
  try {
    let brands = await Brand.find().exec();
    return res.status(200).json({ brands });
  } catch (error) {
    console.log("Error getting all Brands", error);
    return res.status(500).send("Server Error");
  }
};
