const userDb = require("../models/user");
const fs = require("fs");
const { createHmac } = require("crypto");
const { generateToken, verifyToken } = require("../services/auth");

async function sinupUser(req, res) {
  try {
    const { fullName, phone, password } = req.body;
    const user = await userDb.findOne({ phone: phone });
    if (user) {
      return res.status(500).json({ success: false, message: "user already exist" });
    }
    await userDb.create({
      fullName,
      phone,
      password,
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false,message:'in error' });
  }
}

async function sininUser(req, res) {
  try {
    const { phone, password } = req.body;
    const user = await userDb.findOne({ phone: phone });
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "user not found" });
    }
    if (matchPassword(user, password)) {
      let token = generateToken(user);
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: true, // Set this to true if you're using HTTPS
        sameSite: "None",
      });
      return res.json({ success: true, token: token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "password incorrect" });
    }
  } catch (error) {
    return res.status(500).json({ success: false });
  }
}

function matchPassword(user, password) {
  const salt = user.salt;
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return hashedPassword == user.password;
}

async function profile(req, res) {
  try {
     let token = req.cookies.auth_token;
    if (!token) {
       const authHeader =
         req.headers["authorization"] || req.headers["Authorization"];
         token = authHeader;
    }
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "unothorized" });
    }
    const profileData = await userDb.findOne(
      { phone: decoded?.phone },
      { fullName: 1, phone: 1, profileImage:1 }
    );
    if (!profileData) {
      return res.status(401).json({ success: false, message: "unothorized" });
    }
    res.json(profileData);
  } catch (error) {
    res.json({ success: false, message: "error happened" });
  }
}

async function updateProfile(req, res) {
  try {
    let token = req.cookies.auth_token;
    if (!token) {
      const authHeader =
        req.headers["authorization"] || req.headers["Authorization"];
      token = authHeader;
    }
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "unothorized" });
    }
     const { fullName, phone, profileImage } = req.body;
    const result = await userDb.updateOne(
      { phone: decoded?.phone },
      { $set: { profileImage: profileImage } }
    );
    console.log(result)
    if (result.modifiedCount === 0) {
      return { status: 404, message: "User not found or no changes made" };
    }
    const profileData = await userDb.findOne(
      { phone: decoded?.phone },
      { fullName: 1, phone: 1, profileImage: 1 }
    );
    if (!profileData) {
      return res.status(401).json({ success: false, message: "unothorized" });
    }
    res.json(profileData);
  } catch (error) {
    res.json({ success: false, message: "error happened" });
  }
}



module.exports = {
  sinupUser,
  sininUser,
  profile,
  updateProfile,
};
