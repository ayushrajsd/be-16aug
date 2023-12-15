const express = require("express");
const reviewRouter = express.Router();
const Review = require("../models/reviewModel");
const { protectRoute } = require("../controllers/authController");
const Product = require("../models/productModel");

reviewRouter.post("/:productId", protectRoute, async function (req, res) {
  /**
   * 1. get the product id from the params
   * 2. get the review from the body
   * 3. get the user id from the req.userId
   * 7. update average rating of the product
   * 4. create a review object
   * 5. save the review object
   * 6. push the review id in the product reviews array
   */
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const { review, rating } = req.body;

    const reviewObj = await Review.create({
      review,
      rating,
      user: userId,
      product: productId,
    });

    const productObj = await Product.findById(productId);
    const averageRating = productObj.averageRating;
    if (averageRating) {
      let sum = averageRating * productObj.reviews.length;
      let finalAverageRating = (sum + rating) / (productObj.reviews.length + 1);
      productObj.averageRating = finalAverageRating;
    } else {
      productObj.averageRating = rating;
    }
    productObj.reviews.push(reviewObj._id);
    console.log("product",productObj);
    await productObj.save();
    res.status(200).json({
      message: "Review created",
      data: reviewObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});
reviewRouter.get("/:productId", async function (req, res) {});

module.exports = reviewRouter;
