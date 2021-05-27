const router = require("express").Router();

const verifyApi = require("../middleware/verifyInternApi");

const User = require("../models/user/User");
const nodeHtmlToImage = require('node-html-to-image')
const ejs = require("ejs")

router.post("/getLevelInfo", async (req, res) => {

    const data = await ejs.renderFile("./views/userprofile.ejs", {name: "Test name", level: "100", xp: "100"});

    const url = makeToken(10) + "-img.png";

    nodeHtmlToImage({
        output: "./public/img/info/" + url,
        html: data
    })
        .then(() => res.status(200).json({data: "https://weebskingdom.com/img/info/" + url,message: "complete"}));
});

function makeToken(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;