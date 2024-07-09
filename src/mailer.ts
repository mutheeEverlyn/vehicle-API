import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use the generated app password 
  }
});

// Function to send welcome email
export const sendEmail = async (to: string, name: string) => {
  if (!to) {
    throw new Error('please add  email address');
  }

  
  
  const html = `
  <!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="utf-8" />
      <title>Everlyn's clothes</title>
      <style>
          body {
              background-color: #fff;
              font-family: 'Montserrat', sans-serif;
              }
  
          .header {
              text-transform: uppercase;
              font-size: 20px;
          }
  
          .welcome {
              font-family: 'Playfair Display', serif;
              color: black;
              font-size: 25px;
              margin-top: 10px;
          }
  
          .container {
              font-family: 'Montserrat', sans-serif;
              color: black;
              font-size: 18px;
              font-weight: bold;
              margin: 10px 0;
          }
      </style>
  </head>
  
  <body>
                      <h1><a href="#" style="text-decoration: none; color: black;">juneva's vehicle rental management system</a></h1>
                      <h2 class="welcome">Welcome, ${name}!</h2>
                      <p class="container">Thank you for registering at with us.</p>
                      <div>
                          <h2>We offer best prices for hiring of any car of your choice</h2>
                          <a href="#">rent yours today!</a>
                      </div>
               
  </body>
  
  </html>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to  juneva\'s vehicle rental system',
    html
  };

  await transporter.sendMail(mailOptions);
};