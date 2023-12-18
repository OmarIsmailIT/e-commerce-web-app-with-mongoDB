import { Request, Response } from "express";
import Product from "../models/products.model";
import Reviews from "../models/reviews.model";
import Order from "../models/order.model";
import OrderItem from "../models/orderItem.model";
import User, { UserDocument } from "../models/user.model";

// get the product information
export const productInfo = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    console.log(`Received product ID: ${productId}`);

    const product = await Product.findById(productId);
    const count = await Reviews.countDocuments({ product_id: productId });
    if (product) {
      const productInfo = {
        ...product.toJSON(),
        ratingCount: count,
      };
      res.status(200).json(productInfo);
    } else {
      res.status(404).json({
        message: "product not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

export const productRelated = async (req: Request, res: Response) => {
  try {
    const randomProducts = await Product.aggregate([{ $sample: { size: 5 } }]);

    if (randomProducts.length > 0) {
      res.status(200).json({ products: randomProducts });
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// get all the reviews of an product
export const productReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Reviews.find({ product_Id: productId })
      .populate({
        path: "user_Id",
        model: "User",
        select: "first_name last_name",
      })
      .lean();

    if (reviews.length > 0) {
      const reviewsWithFullName = reviews.map((review) => {
        const user = review.user_Id as {
          first_name?: string;
          last_name?: string;
        };
        return {
          ...review,
          userFullName: `${user.first_name} ${user.last_name}`,
        };
      });
      res.status(200).json({ reviews: reviewsWithFullName });
    } else {
      res
        .status(404)
        .json({ message: `There is no reviews for this product ${productId}` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

// create an order if it doesn't exist and if it's status not in_cart
export const addProductToCart = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserDocument;
    const { orderItemQuantity } = req.body;
    const { productId } = req.params;

    // Check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if there is enough stock available
    if (product.stock_quantity < orderItemQuantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Find the user's existing "in-cart" order
    let cart = await Order.findOne({ user_id: user._id, status: "in_cart" });

    if (!cart) {
      // If no "in-cart" order exists, create a new one
      cart = await Order.create({
        user_id: user._id,
        address_id: null,
        status: "in_cart",
        total_price: 0,
        tax: 2,
        order_items: [], // Initialize order_items array
      });
    }

    // Find the existing order item for the given product
    let orderItem = await OrderItem.findOne({
      product_id: productId,
      order_id: cart._id,
    });

    if (orderItem) {
      // If the order item already exists, update its quantity and sub-total
      orderItem.quantity = orderItemQuantity;
      orderItem.sub_total =
        (product.price - product.price * (product.discount / 100)) *
        orderItem.quantity;
      await orderItem.save();
    } else {
      // If the order item doesn't exist, create a new one and save it to the database
      orderItem = await OrderItem.create({
        quantity: orderItemQuantity,
        order_id: cart._id,
        product_id: productId,
        sub_total:
          (product.price - product.price * (product.discount / 100)) *
          orderItemQuantity,
      });

      // Add the order item's id to the order_items array in the cart
      cart.order_items.push(orderItem._id);
      await cart.save();
    }

    // Deduct the orderItemQuantity from the product's stock
    product.stock_quantity -= orderItemQuantity;
    await product.save();

    // Update the total price of the cart
    const orderItems = await OrderItem.find({ order_id: cart.id });

    let newTotalPrice = 0;

    for (const item of orderItems) {
      newTotalPrice += item.sub_total;
    }

    cart.total_price = newTotalPrice;
    await cart.save();

    res.status(201).json({
      message: "The product added as an order item to the cart",
      cart: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};
