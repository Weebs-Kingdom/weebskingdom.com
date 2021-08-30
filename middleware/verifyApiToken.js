const apiToken = require('../models/ApiTokens');

module.exports = async function (req, res, next) {
    const token = req.header("api-token");
    const vToken = await apiToken.findOne({token: token});
    if (!vToken) return res.status(404).json({status: 404, message: "token invalid"});

    req.apiUser = vToken.user;
    next();
};