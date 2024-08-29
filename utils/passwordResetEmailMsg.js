function passwordResetEmailMsg() {
  const message = `
   <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset Request</title>
    <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
      }
      .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
      }
      .header {
          background-color: #dc3545;
          color: #ffffff;
          padding: 20px;
          text-align: center;
      }
      .content {
          padding: 30px;
      }
      .content h2 {
          color: #333333;
          margin-bottom: 20px;
      }
      .content p {
          color: #555555;
          line-height: 1.6;
          margin-bottom: 20px;
      }
      .reset-button {
          display: inline-block;
          padding: 12px 25px;
          background-color: #dc3545;
          color: #ffffff;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          margin-top: 20px;
          transition: background-color 0.3s ease;
      }
      .reset-button:hover {
          background-color: #c82333;
      }
      .footer {
          padding: 20px;
          text-align: center;
          color: #777777;
          font-size: 14px;
          background-color: #f7f7f7;
          border-top: 1px;
          border-top: 1px solid #e0e0e0;
      }
      .footer p {
          margin: 0;
      }
      .contact-info {
          margin-top: 20px;
          color: #555555;
          line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <h2>Hello [User's Name],</h2>
        <p>
          You recently requested to reset your password for your account. Please
          click the button below to reset it:
        </p>
        <a href="[Password Reset Link]" class="reset-button">Reset Password</a>
        <p>
          If you did not request a password reset, please ignore this email or
          reply to let us know. This password reset link is only valid for the
          next 24 hours.
        </p>
        <p>For further assistance, feel free to contact us:</p>
        <div class="contact-info">
          <p>
            Email:
            <a href="mailto:loordhujeyakumar@gmail.com"
              >loordhujeyakumar@gmail.com</a
            >
          </p>
          <p>Phone: <a href="tel:+9600693684">+91 96006 93684</a></p>
        </div>
      </div>

      <div class="footer">
        <p>
          If you have any questions, please don't hesitate to contact us at the
          information above.
        </p>
        <p>Thank you,</p>
       
      </div>
    </div>
  </body>
</html>


    `;

  return message;
}

module.exports = passwordResetEmailMsg;
