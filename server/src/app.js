const Koa = require("koa");
const cors = require("@koa/cors");
const bodyparser = require("koa-bodyparser");
require("dotenv").config();
const res_api = require("koa.res.api");
const router = require("./routes");

const app = new Koa();
app.use(cors());
app.use(bodyparser());
app.use(res_api());
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log("Lisent port：", process.env.PORT);
});
