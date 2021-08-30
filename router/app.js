const router = require("express").Router();
const user = require("./user");
const yuki = require("./yuki");
const shop = require("./shop");
const yukidb = require("./yukidb");
const alexa = require("./alexa");

router.use("/api/user", user);
router.use("/api/yuki", yuki);
router.use("/api/alexa", alexa);
router.use("/api/shop", shop);
router.use("/api/yukidb", yukidb);

module.exports = router;