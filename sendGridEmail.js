require("dotenv").config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);
const msg = {
    to: 'raj.ayush@scaler.com',
    from: 'jasbir.singh@scaler.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail
    .send(msg)
    .then(() => {
    console.log('Email sent');
})
    .catch((error) => {
    console.error(error);
});