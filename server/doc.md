# API Doc

## Wallpapers

主要分为以下几点:
- 获取壁纸
- 上传壁纸
- 评价壁纸
- 搜索壁纸

逐一说明:
### 获取壁纸
```js
GET:  /wallpapers/page/:pageNum

response:
{
  code: 0,
  msg: "success",
  data: [
    {
      ...
    }
  ]
}
```

### 上传壁纸
```js
PUT: /wallpapers
```

### 评价壁纸
```js
POST: /scores/

request data:
{
  like: true,
  wallpaperId: xxxx
}
```

### 搜索壁纸
```js
GET: /wallpapers/search?query=keyword
```

## User
- Login
- Register
- Delete

### 注册用户
```js
POST: /user/register

request data:
{
  username: '',
  hashPass: '',
  wechat: '',
  email: ''
}
```

### 登录验证
```js
POST: /user/login

request data:
{
  username: '',
  hashPass: ''
}
```

### 注销账户

```js
DELETE /user
```

## Todo List

- 增
- 删
- 改
- 查


