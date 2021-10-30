const Koa = require("koa");
const cors = require("@koa/cors");
require("dotenv").config();
const res_api = require("koa.res.api");
const router = require("./routes");
const koaBody = require("koa-body");
const path = require("path");

const app = new Koa();
app.use(
  koaBody({
    json: true,
    multipart: true,
    formlimit: 1,
    formidable: {
      uploadDir: path.join(__dirname, "..", "public") || process.env.SHARE_DIR,
      formlimit: 5 * 1024 * 1024, // default is 2M
      keepExtensions: true,
      hash: "md5",
    },
  })
);
app.use(cors());
app.use(res_api());
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log("Lisent port：", process.env.PORT);
});
