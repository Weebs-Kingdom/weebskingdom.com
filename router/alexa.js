const router = require("express").Router();
const fetch = require('node-fetch');
const ApiToken = require("../models/ApiTokens");
const verifyApi = require('../middleware/verifyApiToken')
const verifyIntern = require("../middleware/verifyInternApi");

router.post("/dispatchYukiCommand", verifyApi, async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({instruction: "dispatchCommand", data: {cmd: req.body.cmd, user: req.apiUser}})
    };

    fetch('http://127.0.0.1:5003/api', options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
});

router.get("/createVerifyToken", async (req, res) => {
    var tokn = makeToken(30, true, true, true);
    var regToken = makeToken(5, true, false, false);

    while (!await ApiToken.find({token: tokn}))
        tokn = makeToken(30, true, true, true);

    while (!await ApiToken.find({regToken: regToken}))
        regToken = makeToken(30, true, true, true);

    const tk = new ApiToken({
        token: tokn,
        regToken: regToken
    });

    await tk.save();

    res.status(200).json({token: regToken});
});

router.post("/verifyToken", async (req, res) => {
    var token = await ApiToken.findOne({regToken: req.body.token});

    if (!token) return res.status(400).json({message: "Token doesnt exist!", status: 400});
    if(token.setup) return res.status(401).json({message: "Token expired!", status: 401});
    if(!token.user)return res.status(401).json({message: "Token not setup!", status: 401});

    const time = new Date(token.finishedUp);
    const expireTime = time.setMinutes(time.getMinutes() + 2);
    const now = new Date();
    if (now > expireTime) return res.status(401).json({status: 401, message: "Token expired!"});
    token.setup = true;
    await token.save();
    res.status(200).json({token: token.token, status: 200});
});

router.post("/userVerify", verifyIntern, async (req, res) => {
    var token = await ApiToken.findOne({regToken: req.body.token});

    if (!token) res.status(400).json({message: "Token doesnt exist!", status: 400});
    if(token.user) res.status(400).json({message: "Token already setup!", status: 400});

    token.user = req.body.user;
    token.finishedUp = Date.now();

    await token.save();
    res.status(200).json({status: 200});
});

function makeToken(length, capital, small, number) {
    var result = '';
    var characters = '';
    var capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var smalls = 'abcdefghijklmnopqrstuvwxyz';
    var numbers = '0123456789';

    if (capital)
        characters += capitals;
    if (small)
        characters += smalls;
    if (number)
        characters += numbers;

    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;