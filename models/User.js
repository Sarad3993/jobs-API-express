const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 8,
  },
});


// * Mongoose middleware
// this mongoose middleware will hash the password before saving it to the database
// this is a much better way than hashing the password in the controller because if we hash the password in the controller, then we will have to hash the password again if we update the password
// this middleware will only run after the user is created or updated
userSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10);
  // 10 means no of rounds of hashing
  // the bigger the number the more secure the password is; but more rounds also means more time to hash the password and requires more processing power and memory
  this.password = await bcrypt.hash(this.password, salt);
})


// * Mongoose methods
// we signed the jwt using mongose methods instead of signing in the controller cuz if we sign the jwt inside controller, then we will have to sign the jwt again if we update the user
// but if we sign the jwt in the mongoose methods, then we can just call this method to sign the jwt anywhere in the application 
userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,name:this.name}, process.env.JWT_SECRET, {expiresIn:'30d',})
}

module.exports = mongoose.model('User', userSchema);