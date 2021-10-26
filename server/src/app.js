const Koa = require("koa");
const cors = require("@koa/cors");
const bodyparser = require("koa-bodyparser");
require("dotenv").config();
const res_api = require("koa.res.api");
const router = require("./routes");
const serve = require("koa-static");
const path = require("path");

const app = new Koa();
app.use(cors());
app.use(bodyparser());
app.use(res_api());
app.use(router.routes()).use(router.allowedMethods());
const staticPath = path.join(__dirname, "public");
app.use(
  serve(staticPath, {
    maxage: 1000 * 60 * 60 * 24 * 30,
    hidden: true,
    defer: true,
  })
);

app.listen(process.env.PORT, () => {
  console.log("服务器启动，监听端口：", process.env.PORT);
});
