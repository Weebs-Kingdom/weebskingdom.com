const router = require("express").Router();

const verifyApi = require("../middleware/verifyInternApi");

const nodeHtmlToImage = require('node-html-to-image');
const ejs = require("ejs");
var fs = require('fs');
const schedule = require('node-schedule');

router.post("/getLevelInfo", verifyApi, async (req, res) => {
    const data = await ejs.renderFile("./views/userprofile.ejs", req.body);

    const url = makeToken(10) + "-img.png";
    const savepath = "./public/img/info/" + url;

    nodeHtmlToImage({
        output: savepath,
        html: data
    })

        .then(() => res.status(200).json({data: "https://weebskingdom.com/img/info/" + url, message: "complete"}));

    const job = schedule.scheduleJob({second: 10}, async function (fireDate) {
        fs.unlinkSync(savepath);
        job.cancel();
    });
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