const nodemiler = require("nodemailer");

const sendEmail = async (options) => {
    //transporter
    const transporter = nodemiler.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    //emial options
    const mailOptions = {
        from: `Servify Team <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    //send the mail
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
