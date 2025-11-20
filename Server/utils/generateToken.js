const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 100,
  });

  return generateToken;
};

module.exports = generateToken;
