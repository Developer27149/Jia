const Router = require("@koa/router");
const { login, register } = require("../routes/controllers/user.js");
const { getMyNet163AccountData } = require("../utils/net163.js");

const router = new Router();
router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/net163", getMyNet163AccountData);

module.exports = router;
