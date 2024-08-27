const express = require('express')
const { sinupUser, sininUser, profile } = require("../controllers/user");

const route = express.Router();

route.route("/sinup").post(sinupUser);
route.route("/sinin").post(sininUser);
route.route("/profile").get(profile);

module.exports = route;

