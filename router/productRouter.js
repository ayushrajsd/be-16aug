const express = require("express");
const Product = require("../models/productModel");

const productRouter = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  deleteProductById,
} = require("../controllers/productController");
const { checkInput } = require("../utils/crudFactory");
/*** Routes for Products * */
// productRouter.get("/", getProducts);
productRouter.get("/", getProductsHandler);
productRouter.post("/", checkInput, createProduct);
productRouter.get("/:id", getProductById);
productRouter.delete("/:id", deleteProductById);

async function getProductsHandler(req, res) {
  try {
    const sortQuery = req.query.sort;
    const selectQuery = req.query.select;
    // console.log(sortParams, selectParams);
    // sort logic
    let queryResPromise = Product.find();
    if (sortQuery) {
      const [sortParam, order] = sortQuery.split(" ");
      if (order === "asc") {
        queryResPromise = queryResPromise.sort(sortParam);
      } else {
        queryResPromise = queryResPromise.sort(`-${sortParam}`);
      }
    }
    if(selectQuery){
        queryResPromise = queryResPromise.select(selectQuery)
    }
    
    const result = await queryResPromise;

    res.status(200).json({
      message: "Get products successful",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports = productRouter;
