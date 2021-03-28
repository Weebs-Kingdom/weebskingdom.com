const router = require("express").Router();
const verify = require("../middleware/verifyLoginToken");
const vAdmin = require("../middleware/verifyAdminAcces");
const vDev = require("../middleware/verifyDev");
const fetch = require('node-fetch');

//dev
router.get("/monsters", verify, vDev, async (req, res) => {
    redirectGet(res, "monster");
});

router.patch("/monsters", verify, vDev, async (req, res) => {
    redirectPatch(req.body, res, "monster");
});

router.delete("/monsters", verify, vDev, async (req, res) => {
    redirectDelete(req.body, res, "monster");
});

router.post("/monsters", verify, vDev, async (req, res) => {
    redirectPost(req.body, res, "monster");
});

router.get("/attacks", verify, vDev, async (req, res) => {
    redirectGet(res, "attack");
});

router.delete("/attacks", verify, vDev, async (req, res) => {
    redirectDelete(req.body, res, "attack");
});

router.post("/attacks", verify, vDev, async (req, res) => {
    redirectPost(req.body, res, "attack");
});

router.patch("/attacks", verify, vDev, async (req, res) => {
    redirectPatch(req.body, res, "attack");
});

router.get("/items", verify, vDev, async (req, res) => {
    redirectGet(res, "item");
});

router.delete("/items", verify, vDev, async (req, res) => {
    redirectDelete(req.body, res, "item");
});

router.patch("/items", verify, vDev, async (req, res) => {
    redirectPatch(req.body, res, "item");
});

router.post("/items", verify, vDev, async (req, res) => {
    redirectPost(req.body, res, "item");
});

router.get("/jobs", verify, vDev, async (req, res) => {
    redirectGet(res, "job");
});

router.delete("/jobs", verify, vDev, async (req, res) => {
    redirectDelete(req.body, res, "job");
});

router.patch("/jobs", verify, vDev, async (req, res) => {
    redirectPatch(req.body, res, "job");
});

router.post("/jobs", verify, vDev, async (req, res) => {
    redirectPost(req.body, res, "job");
});

router.get("/topic", verify, vDev, async (req, res) => {
    redirectGet(res, "topic");
});

router.delete("/topic", verify, vDev, async (req, res) => {
    redirectDelete(req.body, res, "topic");
});

router.patch("/topic", verify, vDev, async (req, res) => {
    redirectPatch(req.body, res, "topic");
});

router.post("/topic", verify, vDev, async (req, res) => {
    redirectPost(req.body, res, "topic");
});

router.get("/topiccategory", verify, vDev, async (req, res) => {
    redirectGet(res, "topiccategory");
});

router.delete("/topiccategory", verify, vDev, async (req, res) => {
    redirectDelete(req.body, res, "topiccategory");
});

router.patch("/topiccategory", verify, vDev, async (req, res) => {
    redirectPatch(req.body, res, "topiccategory");
});

router.post("/topiccategory", verify, vDev, async (req, res) => {
    redirectPost(req.body, res, "topiccategory");
});

router.get("/recipe", verify, vDev, async (req, res) => {
    redirectGet(res, "recipe");
});

router.delete("/recipe", verify, vDev, async (req, res) => {
    redirectDelete(req.body, res, "recipe");
});

router.patch("/recipe", verify, vDev, async (req, res) => {
    redirectPatch(req.body, res, "recipe");
});

router.post("/recipe", verify, vDev, async (req, res) => {
    redirectPost(req.body, res, "recipe");
});


//admin
router.get("/redeem", verify, vAdmin, async (req, res) => {
    redirectGet(res, "redeem");
});

router.delete("/redeem", verify, vAdmin, async (req, res) => {
    redirectDelete(req.body, res, "redeem");
});

router.patch("/redeem", verify, vAdmin, async (req, res) => {
    redirectPatch(req.body, res, "redeem");
});

router.post("/redeem", verify, vAdmin, async (req, res) => {
    redirectPost(req.body, res, "redeem");
});


//all
router.get("/discuser", verify, async (req, res) => {
    redirectPost({id: req.dbUser.discordId}, res, "getUser");
});

router.get("/getUserRecipes", verify, async (req, res) => {
    redirectPost({id: req.dbUser.discordId}, res, "getUserRecipes");
});

router.get("/punch", verify, async (req, res) => {
    redirectPost({id: req.dbUser.discordId}, res, "punch");
});

router.get("/getUserInventory", verify, async (req, res) => {
    redirectPost({id: req.dbUser.discordId}, res, "getUserInventory");
});

router.post("/craft", verify, async (req, res) => {
    redirectPost({id: req.dbUser.discordId, recipe: req.body.recipe}, res, "craft");
});

router.post("/redeemcode", verify, async (req, res) => {
    redirectPost({id: req.dbUser.discordId, code: req.body.code}, res, "redeemcode");
});

async function redirectGet(res, api) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        }
    };
    const json = await fetch('http://127.0.0.1:5004/api/yuki/' + api, options).then(r => r.json()).then(json => {
        if (res != "override")
            return res.status(200).json(json);
        else return json;
    });
    return json;
}

async function redirectPost(jjson, res, api) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(jjson)
    };

    const json = await fetch('http://127.0.0.1:5004/api/yuki/' + api, options).then(res => res.json()).then(json => {
        if (res != "override")
            return res.status(200).json(json);
        else return json;
    });
    return json;
}

function redirectPatch(jjson, res, api) {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(jjson)
    };

    fetch('http://127.0.0.1:5004/api/yuki/' + api, options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
}

function redirectDelete(jjson, res, api) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(jjson)
    };

    fetch('http://127.0.0.1:5004/api/yuki/' + api, options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
}

module.exports = router;
module.exports.getItems = async function () {
    var res = await redirectGet("override", "item");
    return res;
}

module.exports.coins = async function (c, user){
    var res = await redirectPost({coins: c, id: user}, "override", "coins");
    return res;
}

module.exports.item = async function(item, amount, user){
    var res = await redirectPost({item: item, id: user, amount: amount}, "override", "userItem");
    return res;
}

module.exports.lootbox = async function(user){
    var res = await redirectPost({id: user}, "override", "openLootBox");
    return res;
}

module.exports.route = async function(user, route){
    var res = await redirectPost({id: user}, "override", route);
    return res;
}