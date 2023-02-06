const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  // * spread operator (...) is used to spread the properties of req.body into a new object, allowing each property to be passed as a separate argument to User.create() method.
  // Since we are using the method of User model i.e  createJWT() so we need to use ... spread operator to spread the properties of req.body into a new object and pass that new object to User.create() method. 
  //If we do not use spread operator, the user will be created in the database. But the password will not be hashed.
  const token = user.createJWT();
  // createJWT() is a method defined in the User model. here we just invoked it for the user we just created.

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};



const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials!");
  }

  // compare password
  const isPassswordMatch = await user.comparePassword(password);
  // invoke comparePassword() method defined in the User model and pass the password provided by the user in the request as a parameter to that method of User model

  if (!isPassswordMatch) {
    throw new UnauthenticatedError("Invalid Credentials!");
  }

  // sign jwt if everything is ok ie if the user is found and the password is correct
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};



module.exports = { register, login };
