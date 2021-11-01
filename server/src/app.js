const Koa = require("koa");
const cors = require("@koa/cors");
const jwt = require("koa-jwt");
require("dotenv").config();
const res_api = require("koa.res.api");
const router = require("./routes");
const userRouter = require("./routes/user.js");
const koaBody = require("koa-body");
const path = require("path");

const app = new Koa();
app.use(
  koaBody({
    json: true,
    multipart: true,
    formlimit: 5 * 1024 * 1024, // default is 56 kb
    formidable: {
      uploadDir: path.join(__dirname, "..", "public") || process.env.SHARE_DIR,
      keepExtensions: true,
      hash: "md5",
      multiples: false,
    },
  })
);
app.use(cors());
// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use((ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = "请登录认证后再访问";
    } else {
      throw err;
    }
  });
});
app.use(
  jwt({
    secret: process.env.JWT,
  }).unless({
    path: ["/user/login", "/user/register"],
  })
);
app.use(res_api());
app.use(router.routes()).use(router.allowedMethods());
app.use(userRouter.routes()).use(userRouter.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log("Lisent port：", process.env.PORT);
});
