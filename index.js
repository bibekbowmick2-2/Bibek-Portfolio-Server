require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail Address
    pass: process.env.EMAIL_PASS, // Your App Password
  },
});

app.post("/send-email", async (req, res) => {
  const { firstName, lastName, email, phone, service, message } = req.body;

  
  const adminMailOptions = {
    from: "Portfolio Customer",
    to: "bibektotol@gmail.com",
    subject: `New Contact Form Submission from ${firstName} ${lastName}`,
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Service: ${service}
      Message: ${message}
    `,
  };

  
  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email, 
    subject: "Thank You for Contacting Me!",
    text: `
      Hi ${firstName},

      Thank you for reaching out! I have received your message and will get back to you soon.

      Here is a copy of your message:
      -------------------------------------
      Service Requested: ${service}
      Your Message: ${message}
      -------------------------------------

      If you have any urgent inquiries, feel free to contact me at +8801776569120.

      Best Regards,
      Bibek Totol
      ${process.env.EMAIL_USER}
    `,
  };

  try {
    
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(200).json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email", error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
