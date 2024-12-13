const e = require("express");
const { notFoundException, unauthorizedException } = require("../exception");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WorkspaceUserService = require("./WorkspaceUserService");
const WorkspaceUserModel = require("../models/workspaceUser");
const { JWT_SECRET } = require("../../config");
const nodemailer = require("nodemailer");
const { SMTP_EMAIL, SMTP_PASSWORD } = require("../../config");

// Create a Nodemailer transporter with Zoho Mail's SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 587,
  secure: false, // You can set this to false to use STARTTLS
  auth: {
    user: SMTP_EMAIL, // Your Zoho Mail email address
    pass: SMTP_PASSWORD, // Your Zoho Mail password
  },
});
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: SMTP_EMAIL, // Sender's email address (your Zoho Mail email address)
    to, // Recipient's email address
    subject, // Email subject
    html, // Plain text email content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

exports.loginUser = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new notFoundException("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new notFoundException("Invalid Password");
  }

  const accessToken = await jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return accessToken;
};

exports.selectWorkspace = async ({ email, password, workspaceId }) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new notFoundException("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new notFoundException("unauthorized Access!");
  }

  const userWorkspaces = await WorkspaceUserModel.find({
    userId: user._id,
    workspaceId,
  });

  if (!userWorkspaces || userWorkspaces?.length === 0) {
    throw new unauthorizedException("You are not a member of this workspace");
  }

  const userRole = userWorkspaces[0].role;

  const accessToken = await jwt.sign(
    { userId: user._id, workspaceId, role: userRole },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return accessToken;
};

exports.forgetPassword = async ({ email }) => {
  const otp =  Math.floor(100000 + Math.random() * 900000);

  const user = await UserModel.findOne({
    email,
  });
  console.log("user", user._id);
  console.log("otp", otp);
  if (!user) {
    throw new notFoundException("Invalid Email");
  } else {
    const recipientEmail = email;
    const subject = "Your OTP Code";
    const htmlContent = `
                                <html>
                                    <body>
                                         <h1>Your One-Time Password (OTP)</h1>
                                        <p>Your OTP code is: <strong>${otp}</strong></p>
                                    </body>
                                </html>
                            `;

    const info = await sendEmail(recipientEmail, subject, htmlContent);

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { otp: otp },
      { otpExpiry:  Date.now() + 600000 },
    );
    //console.log("updatedUser", updatedUser);
    return Boolean(updatedUser);
  }
};
exports.verifyUser = async ({ email, otp }) => {

  console.log("verifyUser Ser Running");
  const user = await UserModel.findOne({
    email,
    otp,
  });
  console.log(email, otp,user);
  if (!user) {
    throw new notFoundException("Invalid OTP");
  } else {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isActive: true },
      { new: true }
    );
    return updatedUser;
  }
};
exports.resetPassword = async ({ email, otp, password }) => {
  console.log("data", email, otp, password, new Date());
  const user = await UserModel.findOne({
    email,
    otp,
    otpExpiry: { $gt: new Date() },
  });
  console.log("user", user);
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(password || "", Number(saltRounds));

  if (!user) {
    throw new notFoundException("Invalid OTP");
  } else {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { isActive: true },
      { new: true }
    );
    return updatedUser;
  }
};
