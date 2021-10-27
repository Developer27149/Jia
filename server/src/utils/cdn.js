const axios = require("axios");

const request = axios.create({
  baseUrl: "https://api.unsplash.com",
  timeout: 6000,
});

module.exports = {
  request,
};
