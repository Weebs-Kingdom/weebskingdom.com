const router = require("express").Router();
const verify = require("../middleware/verifyLoginToken");
const vAdmin = require("../middleware/verifyAdminAcces");
const fetch = require('node-fetch');

router.get("/monsters", verify, async(req, res) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        }
    };

    fetch('http://127.0.0.1:5004/api/yuki/monster', options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
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

    fetch('http://127.0.0.1:5004/api/yuki/monster', options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
});

router.get("/attacks", verify, async(req, res) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        }
    };

    fetch('http://127.0.0.1:5004/api/yuki/attack', options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
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

    fetch('http://127.0.0.1:5004/api/yuki/attack', options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
});

module.exports = router;