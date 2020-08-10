const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "defd61856b87e5",
        pass: "f4b2a9b323bc35"
    }
});
