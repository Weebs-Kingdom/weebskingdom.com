module.exports = async function (req, res, next) {
    if (req.dbUser.emailVerified && req.dbUser.emailVerified === true)
        if (req.dbUser.discordId != "" && req.dbUser.discordId != undefined)
            next();
        else
            res.status(401).json({status: 401, message: "Discord account not connected!"});
    else
        res.status(401).json({status: 401, message: "Account is not verified"});
};