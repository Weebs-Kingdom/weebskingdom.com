const router = require("express").Router();
const verify = require("../middleware/verifyLoginToken");
const vAdmin = require("../middleware/verifyAdminAcces");
const vDev = require("../middleware/verifyDev");
const fetch = require('node-fetch');

const ShopItem = require("../models/shop/ShopItem");

router.get("/items", async(req, res) => {
    res.status(200).json({status: 200, data: await ShopItem.find()});
});

router.post("/items", verify, vDev, vAdmin, async (req, res) => {
    var si = undefined;

    try {
        si = new ShopItem(req.body)
    } catch (err){
        return res.status(400).json({ status: 400, message: "Invalid data!", err: err });
    }

    await si.save();

    res.status(200).json({status: 200, message: "Added item!"});
});


module.exports = router;