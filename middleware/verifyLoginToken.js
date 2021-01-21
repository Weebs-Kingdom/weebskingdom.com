const jwt = require("jsonwebtoken");
const User = require("../models/user/User");

module.exports = async function(req, res, next) {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ status: 401, message: "Access Denied! Invalid acces token!" });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const time = new Date(verified.ctime);
        const expireTime = time.setHours(time.getHours() + 48);
        const now = new Date();


        if (now > expireTime) return res.status(401).json({ status: 401, message: "Token expired!" });
        const u = await User.findOne({ _id: verified._id });
        if (!u) return res.status(401).json({ status: 401, message: "Access Denied! Not listed anymore!" });
        if(!verified) return res.status(401).json({ status: 401, message: "Access Denied!" });
        req.dbUser = u;
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ status: 401, message: "Access Denied!" });
    }
};