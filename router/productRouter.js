const express = require("express");
const productRouter = express.Router();
const {getProducts,createProduct,getProductById, deleteProductById} = require("../controllers/productController");
const {checkInput} = require('../utils/crudFactory');
/*** Routes for Products * */
productRouter.get("/", getProducts);
productRouter.post("/", checkInput, createProduct);
productRouter.get("/:id", getProductById);
productRouter.delete("/:id", deleteProductById);

module.exports = productRouter;