import nodemailer from "nodemailer"
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_SERVICE_MAIL,
        pass: process.env.EMAIL_SERVICE_PASSWORD
    }
});

export async function sendMail(email, subject, text, html) {
    return await transporter.sendMail({
        from: process.env.EMAIL_SERVICE_MAIL,
        to: email,
        subject,
        text,
        html
    });
}

export function checkLogin() {
    transporter.verify((error, success) => {
        if (error) {
            console.error('Login Failed:', error);
        } else {
            console.log('Login Successful');
        }
    });
}
