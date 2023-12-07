require("dotenv").config();
const nodemailer = require("nodemailer");

// create the transporter using our smtp server details
console.log(process.env.USER); // Should log your Gmail address
console.log(process.env.PASSWORD); // Should log your App Password

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "AYUSH.RAJ.SD@GMAIL.COM",
    pass: process.env.PASSWORD,
  },
});

/** create reusable sendmail function 
    @params {object} options - mail options (to, subject, text, html)
    @params {function} callback - callback function to handle response
    */
const SENDMAIL = async (mailDetails, callback) => {
  try {
    const info = await transporter.sendMail(mailDetails);
    callback(info);
  } catch (error) {
    console.log(error);
  }
};

// an email template that can be used with Nodemailer to send emails

const HTML_TEMPLATE = (text) => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Password</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>OTP for reset</h1>
              </div>
              <div class="email-body">
                <p>${text}</p>
              </div>
              <div class="email-footer">
                <p>EMAIL FOOTER</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
};

//   export default HTML_TEMPLATE;

// const message = "Hi there, you were emailed me through nodemailer"

async function emailBuilder(to, subject, text) {
  try {
    const options = {
      from: "ayush.raj.sd@gmail.com", // sender address
      to: to, // receiver email
      subject: subject, // Subject line
      text: text,
      html: HTML_TEMPLATE(text),
    };
    SENDMAIL(options, (info) => {
      console.log("Email sent successfully");
      console.log("MESSAGE ID: ", info.messageId);
    });
  } catch (err) {
    console.log(err);
  }
}

async function sendEmailHelper(otp, to) {
  const subject = "OTP for reset";
  const text = `Your OTP is ${otp}`;
  await emailBuilder(to, subject, text);
}



module.exports = {
  SENDMAIL,
  HTML_TEMPLATE,
  sendEmailHelper
};
