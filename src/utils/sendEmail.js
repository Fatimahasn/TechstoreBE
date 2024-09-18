const nodemailer = require("nodemailer");
// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ID, // Your Gmail email address
    pass: process.env.GMAIL_PASSWORD, // Your Gmail password or app-specific password
  },
});

let sendEmail = async (receipient, messageBody) => {
  messageBody = `Hi there,\n\nThank you for signing up for Tkxel-Mobile. Click on the link below to verify your email:\n\n${messageBody}\n\nThis link will expire in 24 hours. If you did not sign up for a Tkxel-Mobile account,\nyou can safely ignore this email.\n\nBest Regards,\n\nThe Tkxel Team`;
  // Define email details
  const mailOptions = {
    from: process.env.GMAIL_ID, // Sender's email address
    to: receipient, // Recipient's email address
    subject: "Mobile App Email Verification", // Subject of the email
    text: messageBody, // Email body
  };
  
  // Send the email
  let res=await transporter.sendMail(mailOptions);
  console.log(`Email successfully sent to ${receipient}`);
};

module.exports = sendEmail;
