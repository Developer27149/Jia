const Koa = require("koa");
const cors = require("@koa/cors");
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
app.use(res_api());
app.use(router.routes()).use(router.allowedMethods());
app.use(userRouter.routes()).use(userRouter.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log("Lisent port：", process.env.PORT);
});
