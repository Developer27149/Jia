const Router = require("@koa/router");
const { login, register } = require("../routes/controllers/user.js");

const router = new Router();
router.post("/user/register", register);
router.post("/user/login", login);

module.exports = router;
