const nodemailer = require("nodemailer");

//send mail method
exports.sendMail = (user, subject, body, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.MAIL_ID,
        to: user,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: "Internal Server Error"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Email sent"
        });
    });
}
