const nodemailer = require("nodemailer"); // Import nodemailer for sending emails

const passwordResetEmailMsg = require("./passwordResetEmailMsg");
const envProcessConfigConfig = require("../config/config");
const verificationEmailMessage = require("./VerificationEmailMessage");

// Async function to send a verification email to the user
async function sendVerificationEmail(user, emailTypeStr) {
  try {
    let emailType = {
      isActivationEmail: emailTypeStr === "activationEmail",
      isPasswordResetEmail: emailTypeStr === "passwordResetEmail",
    };
    // Construct the verification email URL using environment variables and user data
    let activationURL = `${envProcessConfigConfig.frontend_baseuri}verify-email/${user._id}/${user.verificationToken}`;
    let resetURL = `${envProcessConfig.frontend_baseuri}resetPassword/${user._id}/${user.resetToken}`;

    let URL = emailType.isActivationEmail ? activationURL : resetURL;

    // Create a Nodemailer transport object with configuration from environment variables
    const transporter = nodemailer.createTransport({
      host: envProcessConfig.email_host,
      port: envProcessConfig.email_port,
      secure: envProcessConfig.email_secure, // Use SSL for secure connection
      auth: {
        user: envProcessConfig.email_user,
        pass: envProcessConfig.email_pass,
      },
    });

    // Verify the transporter connection before sending emails
    await transporter.verify();

    // Create the email message object with sender, recipient, subject, and HTML content
    const message = {
      from: envProcessConfig.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email & Unlock TBC!",
      html: emailType.isActivationEmail
        ? verificationEmailMessage(URL, user.name)
        : passwordResetEmailMsg(URL, user.name), // Generate HTML content using imported function
    };

    // Send the email using the transporter and handle success or failure
    let isSend = await transporter.sendMail(message);
    if (isSend) {
      return isSend;
    } else {
      console.log("Email Sent failed");
      return false;
    }
  } catch (error) {
    // Logging any errors that occur during the process
    console.log("Email not sent");
    console.log(error);
  }
}

// Exporting the sendVerificationEmail function
module.exports = sendVerificationEmail;
