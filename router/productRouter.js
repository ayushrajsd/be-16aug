const express = require("express");
const Product = require("../models/productModel");

const productRouter = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  deleteProductById,
  getProductsHandler,
  getBigBillionProducts,
  getProductCategories
} = require("../controllers/productController");
const { checkInput } = require("../utils/crudFactory");
const { isAuthorized, protectRoute } = require("../controllers/authController");

const authorizedProductRoles = ["admin", "ceo", "sales"];

/*** Routes for Products * */
// productRouter.get("/", getProducts);
productRouter.get("/", getProductsHandler);
productRouter.post("/", checkInput, protectRoute, isAuthorized(authorizedProductRoles),createProduct);
productRouter.get('/bigBillionDay',getBigBillionProducts, getProductsHandler)
productRouter.get('/categories',getProductCategories)
productRouter.get("/:id", getProductById);
productRouter.delete("/:id", protectRoute, isAuthorized(authorizedProductRoles),deleteProductById);



module.exports = productRouter;
