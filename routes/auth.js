const router = require("express").Router();
const { register, login } = require("../controllers/auth");



router.route("/register").post(register);

router.route("/login").post(login);

// we can set routes this way as well:
// router.post("/register",register);
// router.post("/login",login);


module.exports = router;
