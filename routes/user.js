const express = require('express')
const {
  sinupUser,
  sininUser,
  profile,
  updateProfile,
} = require("../controllers/user");

const { imageUpload, upload } = require("../controllers/common");

const route = express.Router();

route.route("/sinup").post(sinupUser);
route.route("/sinin").post(sininUser);
route.route("/profile").get(profile);
route.route("/profile").post(updateProfile);
route.route("/imageUpload").post(upload.single("img"), imageUpload);

module.exports = route;

