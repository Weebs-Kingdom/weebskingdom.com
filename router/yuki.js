const router = require("express").Router();
const verify = require("../middleware/verifyLoginToken");
const vAdmin = require("../middleware/verifyAdminAcces");
const fetch = require('node-fetch');

router.get("/monsters", verify, async(req, res) => {
    makeGet(res, "monster");
});

router.patch("/monsters", verify, async(req, res) => {
    makePatch(req, res, "monster");
});

router.delete("/monsters", verify, async(req, res) => {
    makeDelete(req, res, "monster");
});

router.post("/monsters", verify, async(req, res) => {
    makePost(req, res, "monster");
});

router.get("/attacks", verify, async(req, res) => {
    makeGet(res, "attack");
});

router.delete("/attacks", verify, async(req, res) => {
    makeDelete(req, res, "attack");
});

router.post("/attacks", verify, async(req, res) => {
    makePost(req, res, "attack");
});

router.post("/attacks", verify, async(req, res) => {
    makePost(req, res, "attack");
});

router.get("/items", verify, async(req, res) => {
    makeGet(res, "item");
});

router.delete("/items", verify, async(req, res) => {
    makeDelete(req, res, "item");
});

router.patch("/items", verify, async(req, res) => {
    makePatch(req, res, "item");
});

router.post("/items", verify, async(req, res) => {
    makePost(req, res, "item");
});

router.get("/jobs", verify, async(req, res) => {
    makeGet(res, "job");
});

router.delete("/jobs", verify, async(req, res) => {
    makeDelete(req, res, "job");
});

router.patch("/jobs", verify, async(req, res) => {
    makePatch(req, res, "job");
});

router.post("/jobs", verify, async(req, res) => {
    makePost(req, res, "job");
});

function makeGet(res, api) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        }
    };

    fetch('http://127.0.0.1:5004/api/yuki/' + api, options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
}

function makePost(req, res, api) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(req.body)
    };

    fetch('http://127.0.0.1:5004/api/yuki/' + api, options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
}

function makePatch(req, res, api) {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(req.body)
    };

    fetch('http://127.0.0.1:5004/api/yuki/' + api, options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
}

function makeDelete(req, res, api) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'api-token': process.env.YUKIDB_API_TOKEN
        },
        body: JSON.stringify(req.body)
    };

    fetch('http://127.0.0.1:5004/api/yuki/' + api, options).then(res => res.json()).then(json => {
        res.status(200).json(json);
    });
}

module.exports = router;