// const axios = require('axios');

// const sendOtp = async (email, otp) => {
//   try {
//     const apiKey = '9C8415E7DD368313EB7665BB35B76F42F17E3F698DDE194CDA57DB188407727436BF38551CFAF70E124B0C093856D30E'; // Replace with your Elastic Email API key
//     const fromEmail = 'ms2481095@gmail.com'; // Replace with your verified sender email

//     // Ensure the recipient email is provided
//     if (!email) {
//       throw new Error('Recipient email address is missing.');
//     }

//     // Prepare email body
//     const emailContent = `
//       <h1>Your OTP Code</h1>
//       <p>Your OTP code is: <strong>${otp}</strong></p>
//     `;

//     // Make the API request
//     const response = await axios.post('https://api.elasticemail.com/v2/email/send', null, {
//       params: {
//         apikey: apiKey,
//         to: email, // Pass recipient email
//         subject: 'Your OTP Code',
//         from: fromEmail,
//         bodyHtml: emailContent,
//       },
//     });

//     console.log('OTP sent successfully:', response.data);
//     return true;
//   } catch (error) {
//     console.error('Error sending OTP:', error.response?.data || error.message);
//     return false;
//   }
// };

// module.exports = { sendOtp };
const nodemailer = require("nodemailer");

// Create a transporter using Gmail with App Passwords
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address (set in .env)
    pass: process.env.EMAIL_APP_PASSWORD, // Your Gmail App Password (set in .env)
  },
});

/**
 * Send an OTP to the specified email address
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP to send
 * @returns {Promise<boolean>} - Returns true if email is sent successfully
 */
const sendOtp = async (email, otp) => {
  try {
    if (!email) {
      throw new Error("Recipient email address is missing.");
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Recipient email
      subject: "Your OTP Code",
      html: `
        <h1>Your OTP Code</h1>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code is valid for 5 minutes.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Failed to send OTP. Please try again.");
  }
};

module.exports = { sendOtp };
