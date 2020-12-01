const router = require("express").Router();
const verify = require("../middleware/verifyLoginToken");
const vAdmin = require("../middleware/verifyAdminAcces");

router.get("/monsters", verify, async(req, res) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(req.body)
    };

    const response = await fetch('http://127.0.0.1:5004/api/yuki/monster', options);
    res.status(response.body.status).json(response.body);
});

router.post("/monsters", verify, async(req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(req.body)
    };

    const response = await fetch('http://127.0.0.1:5004/api/yuki/monster', options);
    res.status(response.body.status).json(response.body);
});

router.get("/attacks", verify, async(req, res) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(req.body)
    };

    const response = await fetch('http://127.0.0.1:5004/api/yuki/attack', options);
    res.status(response.body.status).json(response.body);
});

router.post("/attacks", verify, async(req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(req.body)
    };

    const response = await fetch('http://127.0.0.1:5004/api/yuki/attacks', options);
    res.status(response.body.status).json(response.body);
});

module.exports = router;