const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  // spread operator (...) is used to spread the properties of req.body into a new object, allowing each property to be passed as a separate argument to User.create() and creating a new user in the database with those properties.

  const token = user.createJWT(); 
  // createJWT() is a method defined in the User model. here we just invoked it for the user we just created.

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};


const login = async (req, res) => {
  res.send("login user");
};


module.exports = { register, login };
