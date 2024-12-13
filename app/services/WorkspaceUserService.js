const { notFoundException } = require("../exception");
const WorkspaceUserModel = require("../models/workspaceUser");
const IndustryTypeModel = require("../models/industryType");
const WorkspaceModel = require("../models/workspace");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { SMTP_EMAIL, SMTP_PASSWORD } = require("../../config");

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

exports.getAllWorkspaceUsers = async () => {
  const workspaceUsers = await WorkspaceUserModel.find({}).populate(
    "workspaceId userId"
  );
  return workspaceUsers;
};

exports.getWorkspaceUserById = async (id) => {
  const workspaceUser = await WorkspaceUserModel.findById(id).populate(
    "workspaceId userId"
  );
  return workspaceUser;
};

exports.getWorkspaceTeamData = async (team) => {
  const teamIds = team.map((user) => user._id);

  const teamWithRoles = await WorkspaceUserModel.find({
    userId: { $in: teamIds },
  })
    .select("userId role designation") // select the fields you want from the WorkspaceUser model
    .exec();

  const updatedTeam = team.map((teamMember) => {
    const matchingRole = teamWithRoles.find((user) =>
      user.userId.equals(teamMember._id)
    );

    return {
      ...teamMember.toObject(),
      role: matchingRole ? matchingRole.role : null,
      designation: matchingRole ? matchingRole.designation : null,
      phone: matchingRole ? matchingRole.phone : null,
    };
  });

  return updatedTeam;
};

exports.getWorkspaceUserData = async (user) => {
  const teamWithRoles = await WorkspaceUserModel.findOne({
    userId: user._id,
  })
    .select("userId role designation phone") // select the fields you want from the WorkspaceUser model
    .exec();

  const updatedUser = {
    ...user.toObject(),
    role: teamWithRoles ? teamWithRoles.role : null,
    designation: teamWithRoles ? teamWithRoles.designation : null,
  };

  return updatedUser;
};

exports.createWorkspaceUser = async (workspaceUser) => {
  const userIdExists = await UserModel.findOne({
    _id: workspaceUser.userId,
  });

  const workspaceIdExists = await WorkspaceModel.findOne({
    _id: workspaceUser.workspaceId,
  });

  if (userIdExists && workspaceIdExists) {
    const newWorkspaceUser = await new WorkspaceUserModel(workspaceUser).save();
    return newWorkspaceUser;
  } else {
    console.log("User or Workspace not found");
    throw new notFoundException("User or Workspace not found");
  }
};

exports.getUserWorkspaces = async (userId) => {
  const userWorkspaces = await WorkspaceUserModel.find({
    userId: userId,
  }).populate("workspaceId");
  return userWorkspaces;
};

exports.getWorkspaceUsersByWorkspaceId = async (workspaceId) => {
  const workspaceUsers = await WorkspaceUserModel.find({
    workspaceId: workspaceId,
  }).populate({
    path: "userId",
    model: "User",
    select: "_id name email phone",
  });
  const userData = workspaceUsers.map((workspaceUser) => {
    const user = workspaceUser.userId;

    return {
      _id: user._id,
      workspaceuserId: workspaceUser._id,
      workspaceId: workspaceUser.workspaceId,
      name: user.name,
      email: user.email,
      role: workspaceUser.role,
      phone: user?.phone,
      designation: workspaceUser.designation,
    };
  });
  return userData;
};

exports.updateWorkspaceUser = async (workspaceUserId, updateData) => {
  const { name, phone, ...workspaceUserData } = updateData;

  // Update the User model
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: workspaceUserData.userId }, // Assuming UserModel is your User model
    { name, phone },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  const updatedWorkspaceUser = await WorkspaceUserModel.findOneAndUpdate(
    { _id: workspaceUserId },
    updateData,
    { new: true, select: "-createdAt -userId -workspaceId" }
  );

  if (!updatedWorkspaceUser) {
    throw new Error("WorkspaceUser not found");
  }

  return {
    ...updatedWorkspaceUser.toObject(),
    name: updatedUser.name,
    email: updatedUser.email,
  };
};

exports.deleteWorkspaceUserById = async (workspaceUserId) => {
  await WorkspaceUserModel.deleteOne({ _id: workspaceUserId }).exec();
};

exports.createUserAndAddToWorkspace = async (user, workspaceUser) => {
  // Create the user
  const saltRounds = 10;
  const tempPass = user.password;
  const hashedPassword = await bcrypt.hash(
    user.password || "",
    Number(saltRounds)
  );

  user = {
    ...user,
    password: hashedPassword,
    isActive: true,
  };
  const newUser = await new UserModel(user).save();
  workspaceUser = { ...workspaceUser, userId: newUser._id };
  // Add the user to the workspace
  const newWorkspaceUser = await new WorkspaceUserModel(workspaceUser).save();
  const recipientEmail = user?.email;
  const subject = "Your OTP Code";
  const htmlContent = `
                                <html>
                                    <body>
                                         <h1>You have added to our worksapce. Welcome.</h1>
                                        <p>Your password is: <strong>${tempPass}</strong></p>
                                    </body>
                                </html>
                            `;
  const info = await sendEmail(recipientEmail, subject, htmlContent);
  console.log("info", info);
  return newWorkspaceUser;
};
