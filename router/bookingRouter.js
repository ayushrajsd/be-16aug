const express = require("express");
const { protectRoute } = require("../controllers/authController");
const Booking = require("../models/bookingModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/userModel");

const bookingRouter = express.Router();

require("dotenv").config();
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

bookingRouter.use(protectRoute);

bookingRouter.post("/:productId", protectRoute, async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const { priceAtBooking } = req.body;
    const bookingObj = {
      priceAtBooking,
      user: userId,
      product: productId,
    };
    const booking = await Booking.create(bookingObj);
    /** update user with the booking details */
    const user = await User.findById(userId);
    user.bookings.push(booking._id);
    await user.save();
    /** create order */
    var options = {
      amount: priceAtBooking, // amount in the smallest currency unit
      currency: "INR",
      receipt: booking._id.toString(),
    };
    const order = await instance.orders.create(options);
    
    /** updating booking with razor pay payment id */
    booking.paymentOrderId = order.id;
    await booking.save();
    res.status(200).json({
      message: "Booking created",
      data: booking,
      order,
    });
  } catch (err) {
    console.log(err);
  }
});

bookingRouter.get("/", protectRoute, async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate({ path: "user", select: "name email" })
      .populate({ path: "product", select: "name price" });
    res.status(200).json({
      message: "List of all bookings",
      data: allBookings,
    });
  } catch (err) {
    console.log(err);
  }
});

bookingRouter.post("/verify", async (req, res) => {
  try {
    // console.log("request ",req.body);
    console.log("secret", process.env.WEBHOOK_SECRET);
    const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body)); // adding payload to the hash
    const freshSignature = shasum.digest("hex"); // creating hexadecimal digest
    console.log(
      "coMPARING",
      freshSignature,
      req.headers["x-razorpay-signature"]
    );
    if (freshSignature == req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      /** update booking collection */
      const booking = await Booking.findOne({
        paymentOrderId: req.body.payload.payment.entity.order_id,
      });
      booking.status = "confirmed";
      delete booking.paymentOrderId; // this step could be a design decision
      await booking.save();

     
      res.json({ status: "ok" });
    } else {
      return res.status(400).json({ message: "Invalid signature" });
    }
    console.log("webhook called", req.body);
  } catch (err) {
    console.log(err);
  }
});

module.exports = bookingRouter;
