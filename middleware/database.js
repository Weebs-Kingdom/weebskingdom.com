const mongoose = require("mongoose");

module.exports.connect = function() {
    mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }, { useUnifiedTopology: true }).then(
        () => { console.log("Connected to DB") },
        err => { console.log(err) }
    );
}