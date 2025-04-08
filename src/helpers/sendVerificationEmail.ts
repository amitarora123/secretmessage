import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  toEmail: string,
  username: string,
  otp: string
) {
  const emailHtml = `<!DOCTYPE html>
  <html lang="en" dir="ltr">
    <body style="font-family: Verdana, sans-serif; padding: 20px; color: #000000;">
      <p style="font-size: 16px;">
        Here's your verification code: <strong>${otp}</strong>
      </p>
  
      <h2 style="font-size: 24px; margin-bottom: 10px;">Hello ${username},</h2>
  
      <p style="font-size: 16px;">
        Thank you for registering. Please use the following verification code to
        complete your registration:
      </p>
  
      <p style="font-size: 20px; font-weight: bold; margin: 15px 0;">${otp}</p>
  
      <p style="font-size: 16px;">
        If you did not request this code, please ignore this email.
      </p>
  
      <a
        href="http://localhost:3000/verify/${username}"
        style="display: inline-block; padding: 10px 20px; margin-top: 20px;
               background-color: #61dafb; color: white; text-decoration: none;
               border-radius: 4px; font-size: 16px;"
      >
        Verify here
      </a>
    </body>
  </html>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: "Your Verification Code",
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: info.response };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: error };
  }
}
