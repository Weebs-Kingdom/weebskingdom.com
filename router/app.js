const router = require("express").Router();
const user = require("./user");
const yuki = require("./yuki");

router.use("/api/user", user);
router.use("/api/yuki", yuki)

module.exports = router;