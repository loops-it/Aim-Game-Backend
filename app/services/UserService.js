const e = require("express");
const { notFoundException } = require("../exception");
const UserModel = require("../models/user");
const WorkspaceUserModel = require("../models/workspaceUser");
const WorkspaceModel = require("../models/workspace");
const bcrypt = require("bcrypt");
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

exports.getAllUsers = async () => {
  const users = await UserModel.find({});
  return users;
};

exports.getUserById = async (id) => {
  const user = await UserModel.findById(id);
  return user;
};

exports.getUserDetailsByUserIdAndWorkspaceId = async (userId, workspaceId) => {
  try {
    // Get user details
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Get workspace details for the specified workspaceId
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Get role for the user in the specified workspace
    const workspaceUserRole = await WorkspaceUserModel.findOne({
      userId: userId,
      workspaceId: workspaceId,
    });

    if (!workspaceUserRole) {
      throw new Error("User not associated with the specified workspace");
    }

    // Prepare the result object
    const userDetails = {
      userId: user._id,
      name: user.name,
      email: user.email,
      workspace: {
        workspaceId: workspace._id,
        workspaceName: workspace.name,
        role: workspaceUserRole.role,
        designation: workspaceUserRole.designation,
        phone: workspaceUserRole.phone,
      },
    };

    return userDetails;
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (user) => {
  const userEmailExists = await UserModel.findOne({
    email: user.email,
  }).exec();
  if (userEmailExists) {
    if(userEmailExists.isActive == true){
      throw new notFoundException("Email already exists");
    }
    else{
      throw new notFoundException("Email Already registered, But OTP is not confirmed");
    }
  } else {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      user.password || "",
      Number(saltRounds)
    );

    const otp = Math.floor(100000 + Math.random() * 900000);

    user = {
      ...user,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 600000,
      isActive: false,
    };
    const newUser = await new UserModel(user).save();

    const recipientEmail = user?.email;
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
    return Boolean(newUser);
  }
};



exports.updateUser = async (id, user) => {
  if (user.email) {
    const userEmailExists = await UserModel.findOne({
      email: user.email,
      _id: { $ne: id },
    });
    if (userEmailExists) {
      console.log("Email already exists");
      throw new notFoundException("Email already exists");
    }
  }
  if (user.password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      user.password || "",
      Number(saltRounds)
    );
    user = {
      ...user,
      password: hashedPassword,
    };
  }

  if (user.otp) {
    user = {
      ...user,
      otpExpiry: Date.now() + 600000,
    };
  }

  const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
    new: true,
  });
  return updatedUser;
};

exports.deleteUser = async (id) => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  return deletedUser;
};

exports.getAllWorkspacesByUser = async (userId) => {
  const userWorkspaces = await WorkspaceUserModel.find({
    userId: userId,
  }).populate("workspaceId");
  return userWorkspaces;
};

exports.findUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email });
  return user;
};

exports.getRoleByUIDAndWID = async (userId, workspaceId) => {
  const role = await WorkspaceUserModel.findOne({ userId, workspaceId });
  return role;
};

exports.getTeamMembers = async () => {
  const users = await UserModel.find({
    userRole: "team member",
  });
  return users;
};