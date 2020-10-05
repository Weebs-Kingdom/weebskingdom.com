const mongoose = require("mongoose");

module.exports.connect = function() {
    mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, { useUnifiedTopology: true }).then(
        () => { console.log("Connected to DB") },
        err => { console.log(err) }
    );
}