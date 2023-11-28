const jwt = require("jsonwebtoken");
const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.SECRET_JWT, (err, token) => {
      if (err) reject(err);
      resolve(token);
    })
  );

module.exports = createAccessToken;
