function verificationEmailMessage(verificationLink, name) {
  const message = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
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
        background-color: #007bff;
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
      .verify-button {
        display: inline-block;
        padding: 12px 25px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
        margin-top: 20px;
        transition: background-color 0.3s ease;
      }
      .verify-button:hover {
        background-color: #0056b3;
      }
      .footer {
        padding: 20px;
        text-align: center;
        color: #777777;
        font-size: 14px;
        background-color: #f7f7f7;
        border-top: 1px solid #dddddd;
      }
      .footer p {
        margin: 5px 0;
      }
      .contact-info {
        margin-top: 20px;
        font-size: 13px;
        color: #999999;
      }
      .contact-info p {
        margin: 2px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Email Verification</h1>
      </div>
      <div class="content">
        <h2>Hello, ${name}</h2>
        <p>
          Welcome! Thank you for signing up. To complete your registration,
          please verify your email address by clicking the button below:
        </p>
        <a href="${verificationLink}" class="verify-button">Verify Email</a>
        <p>
          If the button doesn't work, please copy and paste the following link
          into your browser:
        </p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <div class="contact-info">
          <p>If you need any assistance, feel free to contact us:</p>
          <p>
            Email:
            <a href="mailto:loordhujeyakumar@gmail.com"
              >loordhujeyakumar@gmail.com</a
            >
          </p>
          <p>Phone: <a href="tel:+919600693684">+91 9600693684</a></p>
        </div>
      </div>
      <div class="footer">
        <p>
          If you did not create this account, you can safely ignore this email.
        </p>
      </div>
    </div>
  </body>
</html>


    `;

  return message;
}

module.exports = verificationEmailMessage;
