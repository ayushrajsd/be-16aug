const bcrypt = require('bcrypt');

const password = 'Ayush@123';

async function hashPassword(password){
    console.time("time taken")
  const salt = await bcrypt.genSalt(12);
  console.log("salt", salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hashedPassword", hashedPassword);
  console.timeEnd("time taken")
  console.log("***************")

  const isMatching = await bcrypt.compare(password, hashedPassword);
  console.log(isMatching);
}


hashPassword(password);