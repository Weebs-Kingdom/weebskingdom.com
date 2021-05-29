module.exports = function (req, res, next) {
    const token = req.header("api-token");
    if (process.env.INTERN_API_TOKEN === token) return next();
    else return res.status(401).json({status: 401, message: "Access Denied!"});
}