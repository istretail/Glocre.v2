const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transport = {
        service: "smtp",
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: options.fromEmail, 
            pass: process.env.SMTP_PASS
        }
    };

    const transporter = nodemailer.createTransport(transport);

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${options.fromEmail}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail ;
