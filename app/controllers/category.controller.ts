import { Request, Response } from "express";

import Category from "../models/category.model";
import Product from "../models/products.model";

export const showCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products", // Use the actual name of your products collection
          localField: "products_ids",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $match: {
          "products.rate": { $gt: 4.5 },
          "products.price": { $lt: 100 },
        },
      },
    ]);
    if (!categories) throw new Error("No category found");
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error: "Error retrieving categories",
    });
  }
};
