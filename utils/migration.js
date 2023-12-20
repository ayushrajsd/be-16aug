const bcrypt = require("bcrypt");
require('./connectWithDb')
const UserModel = require("../models/userModel");

async function UpdateModel(model) {
  const entities = await model.find();
  entities.forEach(async function (entity) {
    const hashedPassword = await bcrypt.hash(entity.password, 12);
    entity.password = hashedPassword;
    await entity.save();
  });
}

UpdateModel(UserModel)
  .then(function () {
    console.log("done");
  })
  .catch(function (err) {
    console.log(err);
  });
