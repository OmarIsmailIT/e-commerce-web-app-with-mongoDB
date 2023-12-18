import { Request, Response } from "express";
import User, { UserDocument } from "../models/user.model";
import Product from "../models/products.model";
import Wishlist, { WishlistDocument } from "../models/wishlist.model";

export const addProductToWishlist = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserDocument;
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the wishlist of the current logged-in user
    const existingWishlistItem = await Wishlist.findOne({
      user_id: user._id,
      product_id: productId,
    }).exec();

    if (existingWishlistItem) {
      return res
        .status(200)
        .json({ message: "This item is already in your wishlist" });
    }

    // Use findOneAndUpdate to update the existing wishlist item or create a new one
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { user_id: user._id },
      { $addToSet: { product_id: productId } },
      { new: true, upsert: true }
    ).exec();

    return res.status(200).json({
      message: "The product added to the wishlist successfully",
      updatedWishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

export const getWishlistProducts = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserDocument;
    const wishlistItems = await Wishlist.find({ user_id: user._id })
      .populate("product_id")
      .exec();

    if (!wishlistItems || wishlistItems.length === 0) {
      return res
        .status(200)
        .json({ message: "No items in your wishlist yet." });
    }

    const products = wishlistItems.map(
      (wishlistItem: WishlistDocument) => wishlistItem.product_id
    );

    return res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};
