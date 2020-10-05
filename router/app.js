const router = require("express").Router();
const auth = require("./auth");

router.use("/api/user", auth);

module.exports = router;