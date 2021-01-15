const router = require("express").Router();
const user = require("./user");
const yuki = require("./yuki");
const shop = require("./shop");

router.use("/api/user", user);
router.use("/api/yuki", yuki);
router.use("/api/shop", shop);

module.exports = router;