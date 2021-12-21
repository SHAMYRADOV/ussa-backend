const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, "kerim", {
    expiresIn: "24h",
  });
};

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user.uuid);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    // secure: true,
    httpOnly: true,
  });

  user.user_password = undefined;

  res.status(statusCode).json({ token });
};
