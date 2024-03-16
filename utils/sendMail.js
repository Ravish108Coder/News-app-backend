//Nodemailer Code
import nodemailer from 'nodemailer';

// var message = "My first Message from Nodemailer"
// var toEmail = "rowdyravish123@gmail.com"

export const sendMail = (toEmail, subject, message) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });


    const mailOptions = {
        from: process.env.EMAIL_NAME, // sender address
        to: toEmail, // list of receivers
        subject: subject, // Subject line
        html: message // plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}