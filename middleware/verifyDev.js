const User = require("../models/User");

module.exports = function(req, res, next) {
    if (req.dbUser.developer) next();
    else return res.status(401).json({ status: 401, message: "Access Denied!" });
};