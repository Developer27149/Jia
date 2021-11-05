const User = require("../../model/User.js");
const { createToken, createHashPassword } = require("../../utils");

module.exports = {
  register: async (ctx) => {
    try {
      const { username, password, email } = ctx.request.body;
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
        let result = await User.create({
          username,
          password: createHashPassword(password),
          email,
        });
        if (result) {
          const { username, email, intro } = result;
          result = {
            username,
            email,
            intro,
          };
        }
        ctx.api(
          200,
          {
            token: createToken({ id: result?.id }),
            result,
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
      const { username, password } = ctx.request.body;
      // username maybe is email
      const result = await User.findOne(
        {
          password: createHashPassword(password),
          $or: [{ username }, { email: username }],
        },
        "username email intro likeWallpaperId uploadWallpaperId"
      );
      ctx.api(
        200,
        { result, token: result ? createToken({ id: result?.id }) : "" },
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
