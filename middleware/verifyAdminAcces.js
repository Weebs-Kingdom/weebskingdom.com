const User = require("../models/user/User");

module.exports = function(req, res, next) {
    if (req.dbUser.admin) next();
    else return res.status(401).json({ status: 401, message: "Access Denied!" });
};