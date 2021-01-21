var nodemailer = require('nodemailer');

let transporter = undefined;

module.exports.connect = function (){
    transporter = nodemailer.createTransport({
        port: process.env.MAIL_PORT,
        host: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PW,
        },
        secureConnection: true
    });

    transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
            console.log("Failed to connect to email server")
        } else {
            console.log("Server is ready to take our messages");
        }
    });
}

module.exports.transporter = function() {
    return transporter;
}