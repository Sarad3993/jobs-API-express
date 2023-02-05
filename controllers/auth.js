const register = async (req, res) => {
  res.send("resgister user");
};

const login = async (req, res) => {
  res.send("login user");
};

module.exports = { register, login };
