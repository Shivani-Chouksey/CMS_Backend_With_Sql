import nodeMailer from 'nodemailer'

const transporter = nodeMailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: process.env.SMTP_EMAIL_PORT || 587, //465
    // secure:process.env.SMTP_EMAIL_PORT == 465,
     secure:false,
    auth: {
        user: process.env.EMAIL_USER,
      //  pass: process.env.EMAIL_APP_PASSWORD
         pass: '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'
    },
    logger: true,   // enable logs
    debug: true,    // show debug output
})


export const Send_Mail = async (options) => {
    try {
        console.log("process.env.SMTP_EMAIL_PORT",process.env.SMTP_EMAIL_PORT);
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
