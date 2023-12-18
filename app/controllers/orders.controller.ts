import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import Order from "../models/order.model";
const OrderItem = require("../models/orderItem.model");
import OrderItemModel, { OrderItemDocument } from "../models/orderItem.model";
import Product from "../models/products.model";
import UserAddress from "../models/userAddress.model";
import User, { UserDocument } from "../models/user.model";

export const changeOrderStatusAndPutAddress = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user as UserDocument;
    const { orderId } = req.params;
    const { addressId, orderItems } = req.body;

    // Find the order by ID and populate the order items
    const order = await Order.findOne({
      user_id: user._id,
      _id: orderId,
    }).populate("order_items");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if an address is provided
    if (addressId) {
      // Update the order's address ID
      order.address_id = addressId;

      // Set the order status to "paid"
      order.status = "paid";
    }

    // Check if orderItems is provided in the request body
    if (orderItems && Array.isArray(orderItems)) {
      // Update order item quantities and product stock quantities
      for (const incomingOrderItem of orderItems) {
        let found = false;

        // Find the existing order item and directly access its properties
        let existingOrderItem: typeof OrderItem;
        for (existingOrderItem of order.order_items) {
          if (
            existingOrderItem._id.toString() ===
            incomingOrderItem._id.toString()
          ) {
            found = true;

            // Check if the quantity has changed
            if (incomingOrderItem.quantity !== existingOrderItem.quantity) {
              const product = await Product.findById(
                existingOrderItem.product_id
              );

              if (!product) {
                console.log(
                  `Product not found for order item ID ${existingOrderItem._id}`
                );
                continue;
              }

              // Calculate the quantity difference
              const quantityDifference =
                incomingOrderItem.quantity - existingOrderItem.quantity;

              // Update product stock quantity
              const updatedStockQuantity =
                product.stock_quantity - quantityDifference;

              // Check if there is sufficient stock
              if (updatedStockQuantity < 0) {
                return res.status(400).json({
                  message: `Insufficient stock for product ${product._id}`,
                });
              }

              // Update product stock quantity
              product.stock_quantity = updatedStockQuantity;
              await product.save();

              // Update order item quantity
              existingOrderItem.quantity = incomingOrderItem.quantity;

              // Calculate the new sub_total for the order item
              existingOrderItem.sub_total =
                existingOrderItem.quantity * product.price;

              // Save the order item changes
              await existingOrderItem.save();
            }
            break;
          }
        }

        // Handle the case where the order item is not found
        if (!found) {
          console.log(
            `Order item with ID ${incomingOrderItem._id} not found in the order.`
          );
        }
      }

      // Calculate the new total_price for the order
      const updatedTotalPrice = order.order_items.reduce(
        (total: number, item: any) => total + item.sub_total,
        0
      );

      // Update order total_price
      order.total_price = updatedTotalPrice;
    }

    // Save the order changes
    await order.save();

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

//////////////////////////////////////////////////////////////////////////////////
export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const { orderItemId } = req.params;
    const user = req.user as UserDocument;

    // Find the order item by ID
    const orderItem = await OrderItemModel.findById(orderItemId);

    if (!orderItem || !orderItem.product_id) {
      return res
        .status(404)
        .json({ message: "Order item or associated product not found" });
    }

    // Find the associated order using the orderID of the order item
    const associatedOrder = await Order.findById(orderItem.order_id);

    console.log("associatedOrder:", associatedOrder);
    console.log("user._id:", user._id);

    // Check if the order item belongs to the authenticated user
    if (!associatedOrder || !associatedOrder.user_id.equals(user._id)) {
      return res.status(403).json({
        message: "Unauthorized: Order item does not belong to the user",
      });
    }

    // Get the sub_total and quantity of the order item to be removed
    const removedSubTotal = orderItem.sub_total;
    const removedQuantity = orderItem.quantity;

    // Find the associated product for the order item
    const associatedProduct = await Product.findById(orderItem.product_id);

    if (!associatedProduct) {
      return res.status(404).json({
        message: "Associated product not found",
      });
    }

    // Increment the product's stock_quantity by the quantity of the deleted order item
    const updatedStockQuantity =
      associatedProduct.stock_quantity + removedQuantity;

    await associatedProduct.updateOne({
      stock_quantity: updatedStockQuantity,
    });

    // Remove the order item from the order item table
    await orderItem.deleteOne();

    await Order.updateOne(
      { _id: associatedOrder._id },
      { $pull: { order_items: orderItem._id } }
    );

    // Check if there are no remaining order items for the associated order
    const remainingOrderItems = await OrderItemModel.countDocuments({
      order_id: associatedOrder._id,
    });

    // If there are no remaining order items, delete the order itself
    if (remainingOrderItems === 0) {
      await associatedOrder.deleteOne();
      return res.status(200).json({
        message: "Order and all order items removed successfully",
      });
    }

    // Subtract the removed sub_total from the total_price in the order table
    const updatedTotalPrice = associatedOrder.total_price - removedSubTotal;
    await associatedOrder.updateOne({ total_price: updatedTotalPrice  });

    return res.status(200).json({ message: "Order item removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

export const getInProgress = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken: any = jwt.verify(token, "top-secret");
    let order = await Order.findOne({
      user_id: decodedToken._id,
      status: "in_cart",
    });
    if (!order) {
      return res.status(200).send({ message: "No orders found!", data: order });
    }

    let items = await OrderItemModel.find({ order_id: order._id });
    let itemsWithImage = [];

    var totalDiscount = 0;
    for (let i = 0; i < items.length; i++) {
      let product = await Product.findById(items[i].product_id);
      let itemWithImage = {
        ...items[i].toJSON(), // Copy existing properties from OrderItem
        image: product?.image_url,
        name: product?.name,
        sub_title: product?.short_description,
        product_price: product?.price,
      };
      if (product?.price !== undefined && product?.discount !== undefined) {
        let totalItemDiscount =
          (items[i].quantity * product.price * product.discount) / 100;
        totalDiscount = totalDiscount + totalItemDiscount;
        itemsWithImage.push(itemWithImage);
      }
    }
    return res.status(200).json({
      data: itemsWithImage,
      total_price: order.total_price,
      total_discount: totalDiscount,
      orderId: order.id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserDocument;

    const orders = await Order.find({ user_id: user._id });
    return res.status(200).json({ data: orders });
  } catch {
    res.status(500).send("server error");
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(200).json({ error: "Order not found" });
    }

    const items = await OrderItemModel.find({ order_id: order._id }).populate(
      "product_id"
    );

    const itemsWithImage = [];
    var totalDiscount = 0;
    for (let i = 0; i < items.length; i++) {
      let product = await Product.findById(items[i].product_id);

      if (!product) {
        // Handle the case where the associated product is not found
        console.error(
          `Product not found for OrderItem with ID ${items[i]._id}`
        );
        continue; // Skip to the next iteration of the loop
      }
      let totalItemDiscount =
        (items[i].quantity * product.price * product.discount) / 100;
      totalDiscount = totalDiscount + totalItemDiscount;
      let itemWithImage = {
        ...items[i].toJSON(), // Copy existing properties from OrderItem
        image: product.image_url,
        name: product.name,
        sub_title: product.short_description,
      };
      itemsWithImage.push(itemWithImage);
    }
    const address = await UserAddress.findOne({ _id: order.address_id });
    return res.status(200).json({
      data: itemsWithImage,
      city: address?.city,
      state: address?.state,
      street: address?.street,
      phone_number: address?.phone_number,
      first_name: address?.first_name,
      last_name: address?.last_name,
      total_price: order.total_price,
      total_discount: totalDiscount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
