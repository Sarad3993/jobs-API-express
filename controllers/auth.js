const User = require('../models/user');
const {StatusCodes}= require('http-status-codes');
const bcrypt = require('bcryptjs');



const register = async (req, res) => {
  const {name, email, password} = req.body;
  const salt = await bcrypt.genSalt(10);
  // 10 means no of rounds of hashing
  // * the bigger the number the more secure the password is; but more rounds also means more time to hash the password and requires more processing power and memory
  // so 10 is a good number to use 
  const hashedpassword = await bcrypt.hash(password,salt)
  const tempUser = {name,email,password:hashedpassword}

  const user = await User.create({...tempUser})
// spread operator (...) is used to spread the properties of req.body into a new object, allowing each property to be passed as a separate argument to User.create() and creating a new user in the database with those properties.
  res.status(StatusCodes.CREATED).json({user});
};

const login = async (req, res) => {
  res.send("login user");
};


module.exports = { register, login };
