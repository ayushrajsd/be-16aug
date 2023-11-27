const Product = require("../models/productModel");
const {getAllFactory,
    createFactory,
    getElementByIdFactory,
    checkInput,
    deleteElementByIdFactory} = require('../utils/crudFactory');
/** handlers */

const getProducts = getAllFactory(Product);
  
  const createProduct = createFactory(Product);
  
  const getProductById = getElementByIdFactory(Product);

  const deleteProductById = deleteElementByIdFactory(Product);
  module.exports = {
    getProducts,
    createProduct,
    getProductById,
    checkInput,
    deleteProductById
  }