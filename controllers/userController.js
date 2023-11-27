const User = require("../models/userModel");
const {getAllFactory,
    createFactory,
    getElementByIdFactory,
    checkInput,
    deleteElementByIdFactory} = require('../utils/crudFactory');
/** handlers */

const getUser = getAllFactory(User);
  
  const createUser = createFactory(User);
  
  const getUserById = getElementByIdFactory(User);

  const deleteUserById = deleteElementByIdFactory(User);
  module.exports = {
    getUser,
    createUser,
    getUserById,
    checkInput,
    deleteUserById
  }