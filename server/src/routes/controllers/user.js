const User = require("../../model/User.js");
const { createToken } = require("../../utils");

module.exports = {
  register: async (ctx) => {
    try {
      const { username, password, intro, email } = ctx.request.body;
      const isExist = await User.exists({ username });
      if (isExist) {
        ctx.api(
          200,
          {},
          {
            code: -1,
            msg: "此用户名已被注册",
          }
        );
      } else {
        User.create({ username, password, intro, email });
        ctx.api(
          200,
          {
            token: createToken({ username }),
          },
          {
            code: 1,
            msg: "注册成功",
          }
        );
      }
    } catch (e) {
      /* handle error */
      console.log(e);
      ctx.api(
        200,
        {},
        {
          code: -1,
          msg: "暂时无法注册,请联系开发者 email:rivenqinyy@gmail.com",
        }
      );
    }
  },
  login: async (ctx) => {
    try {
      const { username, password, email } = ctx.request.body;
      const result = await User.findOne(
        username ? { username, password } : { email, password },
        "username email intro likeWallpaperId uploadWallpaperId"
      );
      ctx.api(
        200,
        { result, token: createToken({ username }) },
        {
          code: result ? 1 : -1,
          msg: result ? "success" : "failed",
        }
      );
    } catch (e) {
      /* handle error */
      console.log(e);
      ctx.api(
        200,
        {},
        {
          code: -1,
          msg: "暂时无法登录,请联系开发者 email:rivenqinyy@gmail.com",
        }
      );
    }
  },
};
