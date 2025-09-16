import nodeMailer from 'nodemailer'

const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_EMAIL_HOST,
    port: process.env.SMTP_EMAIL_PORT, //465
    secure:process.env.SMTP_EMAIL_PORT == 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    logger: true,   // enable logs
    debug: true,    // show debug output
})


export const Send_Mail = async (options) => {
    try {
        console.log("Inside send mail otp", options);
        const info = await transporter.sendMail({
            from: `"Shivani Login OTP :" <${process.env.EMAIL_USER}>`, // ✅ use your Gmail
            to: options?.user,                                         // recipient
            subject: options?.subject || "Login OTP",
            text: `Your OTP is ${options?.otp}`,                       // plain text
            html: options?.body || `<h1>Login Otp - ${options?.otp}</h1>`, // HTML
        });

        console.log("✅ Mail sent successfully");
        console.log("📨 Message ID:", info.messageId);
        return info
        // console.log("📤 Preview URL (if Ethereal):", nodeMailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error while sending mail", error);
        throw error;
    }
}
