const router = require("express").Router();
const verify = require("../middleware/verifyLoginToken");
const vAdmin = require("../middleware/verifyAdminAcces");
const vDev = require("../middleware/verifyDev");
const vActive = require("../middleware/verifyActivatedAcount");
const fetch = require('node-fetch');

const yukiapi = require('./yuki');

const ShopItem = require("../models/shop/ShopItem");

router.get("/items", async (req, res) => {
    res.status(200).json({status: 200, data: await ShopItem.find()});
});

router.post("/items", verify, vDev, vAdmin, async (req, res) => {
    var si = undefined;

    try {
        si = new ShopItem(req.body)
    } catch (err) {
        return res.status(400).json({status: 400, message: "Invalid data!", err: err});
    }

    await si.save();

    res.status(200).json({status: 200, message: "Added item!"});
});

router.delete("/items", verify, vDev, vAdmin, async (req, res) => {
    var tk = await ShopItem.findOne({id: req.body._id});
    await tk.remove();
    res.status(200).json({status: 200, msg: "removed shop item"});
});

router.patch("/items", verify, vDev, vAdmin, async (req, res) => {
    try {
        const savedItem = await ShopItem.findOneAndUpdate({_id: req.body._id}, req.body.data);
        res.status(200).json({status: 200, _id: savedItem._id, message: "patched shopitem"});
    } catch (err) {
        console.log("an error occured! " + err);
        res.status(200).json({
            status: 400,
            message: "error while patching shopitem!",
            error: err,
        });
    }
});

router.post("/checkout", verify, vActive, async (req, res) => {
    var sumPrice = 0;
    var items = [];
    for (const e of req.body.cart) {
        var it = await ShopItem.findById(e._id);
        if (it) {
            it.cartamount = e.amount;
            items.push(it);
            sumPrice += it.price * e.amount;
        }
    }

    var rcoins = undefined;
    try {
        rcoins = await yukiapi.coins(sumPrice * -1, req.dbUser.discordId);
    } catch (e) {
        return res.status(400).json({status: 400, message: "Not enough money"});
    }
    if (rcoins.status != 200) return res.status(400).json({status: 400, message: "Not enough money"});

    for (let i = 0; i < items.length; i++) {
        const e = items[i];
        var ok = false;
        var ritems = undefined;
        try {
            ritems = await yukiapi.item(e.connectedItemId, e.cartamount, req.dbUser.discordId)
            ok = ritems.status == 200;
        } catch (e) {
            ok = false;
        }

        if (!ok) {
            var rRoute = undefined;
            try {
                rRoute = await yukiapi.route(req.dbUser.discordId, e.connectedRoute);
                ok = rRoute.status == 200;
            } catch (e) {
                ok = false;
            }

            if (ok)
                for (let j = 0; j < e.cartamount - 1; j++) {
                    const rRoute = await yukiapi.route(req.dbUser.discordId, e.connectedRoute);
                }
        }

        if (!ok) {
            if (e.connectedRole) {
                const js = await giveUserRole(String(e.connectedRole).toLowerCase(), req.dbUser.discordId);
                if (js.status == 200)
                    ok = true;
            }
        }

        //If item give fails, you get money back lol~
        if (!ok) {
            await yukiapi.coins(e.price * e.cartamount, req.dbUser.discordId);
            sumPrice -= e.price * e.cartamount;
            items.splice(i, 1);
        }
    }
    res.status(200).json({status: 200, items: items, sum: sumPrice});
});

router.post("/openLootbox", verify, vActive, async (req, res) => {
    const r = await yukiapi.lootbox(req.dbUser.discordId);

    res.status(r.status).json(r);
});

function findItem(items, id) {
    for (const a of items) {
        if (id == a._id) {
            return a;
        }
    }
    return undefined;
}

async function giveUserRole(role, discUserId) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({instruction: "giverole", data: {user: discUserId, role: role}})
    };

    return await fetch('http://127.0.0.1:5003/api', options).then(res => res.json()).then(json => {
        return json;
    }).catch(e => {
        return undefined;
    });
}

module.exports = router;