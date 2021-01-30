module.exports = async function(req, res, next) {
    if(req.dbUser.emailVerified&&req.dbUser.emailVerified === true)
        next();
    else
        res.status(401).json({ status: 401, message: "Account is not verified" });
};