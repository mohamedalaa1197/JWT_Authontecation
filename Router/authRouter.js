const Router = require("express");
const { logoutGet, loginget, loginPost, signUpPost, signUpGet } = require("../Controllers/authController.js")
const router = new Router();

router.get("/signup", signUpGet)
router.get("/login", loginget)
router.post("/signup", signUpPost)
router.post("/login", loginPost)
router.get("/logout", logoutGet)
module.exports = router;