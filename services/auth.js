const jwt = require("jsonwebtoken");
const secret = "$asdfghjk";

function generateToken(user) {
  let payload = {
    _id: user._id,
    fullName: user.fullName,
    phone: user.phone,
    profileImage: user.profileImage,
  };
  return jwt.sign(payload, secret);
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = {
  generateToken,
  verifyToken,
};
