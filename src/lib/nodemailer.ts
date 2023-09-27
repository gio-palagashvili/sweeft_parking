import nodemailer from "nodemailer";

if (!process.env.GMAIL_ADDRESS || process.env.GMAIL_ADDRESS.length == 0) {
    console.log("missing gmail address in env");
}
if (!process.env.GOOGLE_PASS_KEY || process.env.GOOGLE_PASS_KEY.length == 0) {
    console.log("missing google passkey address in env");
}

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GOOGLE_PASS_KEY,
    }
})

export const sendMail = (email: string, text: string, subject: string) => {
    transporter.sendMail({
        to: email,
        from: process.env.GMAIL_ADDRESS,
        subject: subject,
        html: text
    }, (error: any) => {
        throw new Error(error);
    })
}