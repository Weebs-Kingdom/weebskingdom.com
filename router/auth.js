const router = require("express").Router();
const User = require("../models/User");
const Tokens = require("../models/Tokens");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("../middleware/verifyLoginToken");
const vAdmin = require("../middleware/verifyAdminAcces");

//VALIDATION
const Joi = require("joi");

const passwordSch = Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));

const emailSch = Joi.string().min(6).max(100).required().email();

const nameSch = Joi.string().min(3).max(30).required();

const regSchema = Joi.object({
    email: emailSch,
    password: passwordSch,
    username: nameSch,
    repeat_password: Joi.ref('password'),
    access_token: Joi.string().required()
});

const loginSchema = Joi.object({
    password: passwordSch,
    email: emailSch
});

const editPasswordSch = Joi.object({
    password: passwordSch,
    repeat_password: Joi.ref('password'),
});

router.get("/yuki/users", verify, async(req, res) => {
    res.status(200).json({ status: 200, data: ["Charmader", "Banananana", "BaumHaus", "BANANANANANAN"] });
});

router.get("/yuki/attacks", verify, async(req, res) => {
    res.status(200).json({ status: 200, data: ["Tackle", "fireball", "BOOOOM!"] });
});

router.post("/password", verify, async(req, res) => {
    const { error } = editPasswordSch.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });
    try {
        const user = req.user._id;
        const hashPassword = await hashPw(req.body.password);
        req.dbUser.password = hashPassword;
        await req.dbUser.save();
        res.status(200).json({ status: 200, message: "did it!" });
    } catch (e) {
        res.status(400).json({ status: 400, message: e });
    }
});

router.post("/username", verify, async(req, res) => {
    const { error } = nameSch.validate(req.body.username);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });
    try {
        const name = req.body.username;
        req.dbUser.name = name;
        await req.dbUser.save();
        res.status(200).json({ status: 200, message: "did it!" });
    } catch (e) {
        res.status(400).json({ status: 400, message: e });
    }
});

router.post("/email", verify, async(req, res) => {
    const { error } = emailSch.validate(req.body.email);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });
    try {
        const email = req.body.email.toLowerCase();
        req.dbUser.email = email;
        await req.dbUser.save();
        res.status(200).json({ status: 200, message: "did it!" });
    } catch (e) {
        res.status(400).json({ status: 400, message: e });
    }
});


router.post("/register", async(req, res) => {
    const { error } = regSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    const token = req.body.access_token;
    const tk = await Tokens.findOne({ token: token });
    if (!tk) return res.status(400).json({ status: 400, message: "Token not found!" });

    if (tk.used >= tk.maxUse) {
        tk.remove();
        res.status(400).json({ status: 400, message: "Token expired!" });
        return;
    }

    if (tk.used + 1 >= tk.maxUse) tk.remove();
    else {
        tk.used = tk.used + 1;
        tk.save();
    }

    //Check if the user is already in the database
    const emailExists = await User.findOne({ email: req.body.email.toLowerCase() });
    if (emailExists) return res.status(400).json({ status: 400, message: "Email already registred!" });

    //Hashing password
    const hashPassword = await hashPw(req.body.password);

    //Create new user
    const cUser = new User({
        name: req.body.username,
        email: req.body.email.toLowerCase(),
        password: hashPassword
    });
    try {
        const savedUser = await cUser.save();
        res.status(200).json({ status: 200, message: savedUser._id });
    } catch (err) {
        res.status(400).json({ status: 400, message: "error while creating new user!", error: err });
    }

});

router.post("/login", async(req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    //Check if the user is in db
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ status: 400, message: "Email or password is wrong!" });

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ status: 400, message: "Email or password is wrong" });

    //Create and assing a token
    const time = new Date();
    const token = jwt.sign({ _id: user._id, ctime: time }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).json({ status: 200, message: token });
});

router.get("/auth", verify, async(req, res) => {
    res.status(200).json({ status: 200, message: "Authenticated!" });
});

router.post("/genToken", verify, vAdmin, async(req, res) => {
    console.log("called");
    var maxUse = req.body.maxUse;
    if (!maxUse) {
        maxUse = 1;
    } else if (maxUse == 0) {
        maxUse = 1;
    }

    var token;
    console.log("we've got this far");
    var doItAgain = true;
    while (true) {
        token = makeToken(6);
        console.log("we've got this far and have a token named " + token);
        if (Tokens.findOne({ token: token }).token != token) break;
    }

    console.log("have a token " + token);

    const cToken = new Tokens({
        token: token,
        maxUse: maxUse
    });
    console.log("a object");

    try {
        const savedToken = await cToken.save();
        console.log("saved");
        res.status(200).json({ status: 200, message: savedToken.token });
    } catch (er) {
        res.status(400).json({ status: 400, message: "Error while creating new token!", error: err });
    }
});

router.get("/name", verify, async(req, res) => {
    res.status(200).json({ status: 200, message: req.dbUser.name });
});

router.get("/email", verify, async(req, res) => {
    res.status(200).json({ status: 200, message: req.dbUser.email });
});

router.get("/isAdmin", verify, vAdmin, async(req, res) => {
    res.status(200).json({ status: 200, message: req.dbUser.admin });
});

async function hashPw(pw) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(pw, salt);
    return hashPassword;
}

function makeToken(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = router;