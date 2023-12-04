const express = require("express");
const Product = require("../models/productModel");

const productRouter = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  deleteProductById,
  getProductsHandler,
  getBigBillionProducts
} = require("../controllers/productController");
const { checkInput } = require("../utils/crudFactory");
/*** Routes for Products * */
// productRouter.get("/", getProducts);
productRouter.get("/", getProductsHandler);
productRouter.post("/", checkInput, createProduct);
productRouter.get('/bigBillionDay',getBigBillionProducts, getProductsHandler)
productRouter.get("/:id", getProductById);
productRouter.delete("/:id", deleteProductById);



module.exports = productRouter;
