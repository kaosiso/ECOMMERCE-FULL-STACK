import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import axios from "axios";

const currency = "usd";
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Cash on Delivery
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!items?.length || !userId || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (items, user, amount, address)",
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      PaymentMethod: "COD",
      payment: false,
      date: Date.now(),
      status: "Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed with Cash on Delivery" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    if (!items?.length || !userId || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (items, user, amount, address)",
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      PaymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
      status: "Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&order_Id=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&order_Id=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stripe verification
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({
        success: false,
        message: "Payment not successful, order cancelled.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Paystack
const placeOrderPaystack = async (req, res) => {
  try {
    const { reference, userId, items, amount, address } = req.body;

    if (!reference || !userId || !items?.length || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required Paystack order fields",
      });
    }

    const verificationResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VITE_PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = verificationResponse.data;

    if (paymentData.status && paymentData.data.status === "success") {
      const orderData = {
        userId,
        items,
        address,
        amount,
        PaymentMethod: "Paystack",
        payment: true,
        date: Date.now(),
        transactionId: reference,
        status: "Pending",
      };

      const newOrder = new orderModel(orderData);
      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({
        success: true,
        message: "Order placed successfully via Paystack",
        orderId: newOrder._id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Paystack error occurred";
    res.status(500).json({
      success: false,
      message: msg,
    });
  }
};

// Admin: Get all orders
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Get their own orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderPaystack,
  allOrders,
  userOrders,
  updateStatus,
};
