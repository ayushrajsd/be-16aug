const Product = require("../models/productModel");
const {getAllFactory,
    createFactory,
    getElementByIdFactory,
    checkInput,
    deleteElementByIdFactory} = require('../utils/crudFactory');
/** handlers */

const getProducts = getAllFactory(Product);

const getProductsHandler = async function(req, res) {
  console.log("getting products")
  /**
   * filter the product -> as per the query params
   * sorting the products -> as per the query params
   * select the fields -> as per the query params
   * pagination -> as per the query params
   */
  try {
    const sortQuery = req.query.sort;
    const selectQuery = req.query.select;
    const filterQuery = req.query.filter;
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
    if(filterQuery){
      console.log("filterQuery beofre",filterQuery)
      // console.log(encodeURI(filterQuery))
      // Parse the filterQuery into an object
      const filterObj = JSON.parse(filterQuery);
      console.log("filterObj",filterObj)

        // const filterObj = JSON.parse(filterQuery);
        // queryResPromise = queryResPromise.find(filterQuery)
        // handling $gt, $gte, $lt, $lte
        // const filterObj = JSON.parse(filterQuery);
        // replacing lt with $lt and so on
        const filterObjStr = JSON.stringify(filterObj).replace(
          /\b(gt|gte|lt|lte)\b/g,
          (match) => `$${match}`
        );
        console.log("filterObjStr",filterObjStr)
        // converting back to object
        const filterObjFinal = JSON.parse(filterObjStr);
        console.log("filterObjFinal",filterObjFinal)
        queryResPromise = queryResPromise.find(filterObjFinal)
    }

    /**
     * pagination logic will be implemented using limit and skip
     * limit -> number of documents to be returned
     * skip -> number of documents to be skipped
     */
    const page = req.query.page  || 1;
    const limit = req.query.limit || 1;
    const skip = (page - 1) * limit;
    console.log("skip",skip)
    // queryResPromise = queryResPromise.skip(skip).limit(limit);
     
    
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

const getBigBillionProducts = async function(req, res, next) {
 /**
  * create a query with stock less than 30
  * rating grater than eq 4.6
  * limit query to 10
  *  */ 
 req.query.filter = JSON.stringify({
   stock:{lt:30},
  //  rating:{gte:4.6},
  //  limit:10
 })
 next()
}
  
  const createProduct = createFactory(Product);
  
  const getProductById = getElementByIdFactory(Product);

  const deleteProductById = deleteElementByIdFactory(Product);
  module.exports = {
    getProducts,
    createProduct,
    getProductById,
    checkInput,
    deleteProductById,
    getProductsHandler,
    getBigBillionProducts
  }