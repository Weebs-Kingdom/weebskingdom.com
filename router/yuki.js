const router = require("express").Router();
const verify = require("../middleware/verifyLoginToken");
const vAdmin = require("../middleware/verifyAdminAcces");

router.get("/monsters", verify, async(req, res) => {
    res.status(200).json({ status: 200, data: ["Charmader", "Banananana", "BaumHaus", "BANANANANANAN"] });
});

router.get("/attacks", verify, async(req, res) => {
    res.status(200).json({ status: 200, data: ["Tackle", "fireball", "BOOOOM!"] });
});

module.exports = router;