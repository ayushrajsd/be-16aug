const express = require("express");
const Razorpay = require("razorpay");
const shortid = require("shortid");

const cors = require("cors"); // part of the node.js core
const crypto = require("crypto");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.post("/checkout", (req, res) => {
  // the details below in a real world app will be fetched via an internal order id
  // when the user finalized their cart, an order id will be generated and passed to this route
  var options = {
    amount: 11000, // amount in the smallest currency unit
    currency: "INR",
    receipt: shortid.generate(),
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
    res.status(200).json({
      message: "Order created",
      data: order,
    });
  });
});

app.post("/verification", (req, res) => {
  try {
    // console.log("request ",req.body);
    console.log("secret",process.env.WEBHOOK_SECRET)
    const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body)); // adding payload to the hash
    const freshSignature = shasum.digest("hex"); // creating hexadecimal digest
    console.log("coMPARING",freshSignature, req.headers["x-razorpay-signature"]);
    if (freshSignature == req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      res.json({ status: "ok" });
    } else {
      return res.status(400).json({ message: "Invalid signature" });
    }
    console.log("webhook called", req.body);
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
