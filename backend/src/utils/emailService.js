
const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your SELLIO Account",
    html: `
      <h2>Welcome to SELLIO!</h2>

      <p>Thank you for registering.</p>

      <p>Please click the button below to verify your email address:</p>

      <a
        href="${verificationLink}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #22c55e;
          color: white;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Verify Email
      </a>

      <p>This verification link will expire in 30 minutes.</p>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
};

