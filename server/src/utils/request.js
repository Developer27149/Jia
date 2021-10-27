const axios = require("axios");

const request = axios.create({
  baseURL: "https://api.unsplash.com",
  timeout: 6000,
});

module.exports = request;
