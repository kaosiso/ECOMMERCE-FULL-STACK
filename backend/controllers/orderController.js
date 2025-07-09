import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import axios from "axios";

// Global variables
const currency = "usd";
const deliveryCharge = 10;
const deliveryChargeUSD = 10;

// Stripe initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place order using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!items?.length || !userId || !amount || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
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

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Place order using Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    if (!items?.length || !userId || !amount || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
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
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charge
    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery Charges",
        },
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
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Place order using Paystack
const placeOrderPaystack = async (req, res) => {
  try {
    console.log("Welcome");
    console.log("Incoming Paystack order:", req.body);

    const { reference, userId, items, amount, address } = req.body;

    if (!reference || !userId || !items?.length || !amount || !address) {
      console.log("Validation Failed", {
        reference,
        userId,
        items,
        amount,
        address,
      });

      return res.status(400).json({
        success: false,
        message: "Missing order details",
      });
    }

    // ✅ No conversion needed here — already in NGN
    const amountNGN = amount;

    // Verify Paystack Payment
    const verificationResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VITE_PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = verificationResponse.data;
    console.log("Paystack Verification Response:", paymentData);

    if (paymentData.status && paymentData.data.status === "success") {
      const orderData = {
        userId,
        items,
        address,
        amount: amountNGN,
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
        message: "Order placed successfully",
        orderId: newOrder._id,
      });
    } else {
      console.log("Payment verification failed");
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error(
      "Paystack error:",
      error.response?.data || error.message || error
    );
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



// Get all orders (admin)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
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
