// nodemailerConfig.js
const nodemailer = require('nodemailer');

// Create a transporter with your email service provider configuration
const transporter = nodemailer.createTransport({
   host: 'smtp.example.com',
    port: 465,
    secure: true,
    service:'gmail',
    auth: {
        type: 'custom',
        method: 'MY-CUSTOM-METHOD', // forces Nodemailer to use your custom handler
        user: 'psamantaray77@gmail.com',
        pass: 'Prakash@909'
    },
});


// Function to send the email verification link
const sendVerificationEmail = (recipientEmail) => {
  transporter.sendMail({
    from: 'psamantaray77@gmail.com',
    to: recipientEmail,
    subject: 'Email Verification',
  }, (error, info) => {
    if (error) {
      console.log('Error occurred while sending the verification email:', error);
    } else {
      console.log('Verification email sent successfully:', info.response);
    }
  });
};



module.exports = sendVerificationEmail;
