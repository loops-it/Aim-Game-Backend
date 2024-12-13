var jwt = require("jsonwebtoken");
const { key } = require("../../config");
const {
  findUserByEmail,
  getRoleByUIDAndWID,
} = require("../services/UserService");
const bcrypt = require("bcrypt");

// Function to create a JWT token
// const createToken = (req, res, next) => {
//   const data = req.body;

//   if (!data) {
//     return res
//       .status(400)
//       .json({ success: false, code: 400, msg: 'Data is required in the request body' });
//   }

//   const token = jwt.sign({ data }, key, { expiresIn: '1h' });
//   console.log(token);

//   return res.status(200).json({ success: true, code: 200, token });
// };

const createToken = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      code: 400,
      msg: "Email and password are required in the request body",
    });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, code: 401, msg: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ email, userId: user._id }, key, {
        expiresIn: "1h",
      });
      const userID = user._id;
      const userRole = user.userRole;
      const userName = user.name;
      return res.status(200).json({ success: true, code: 200, token, userID, userRole, userName });
    } else {
      return res
        .status(401)
        .json({ success: false, code: 401, msg: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, code: 500, msg: "Internal Server Error" });
  }
};

const validateToken = (req, res, next) => {
  const authHeader = req.get("authorization");

  if (!authHeader || authHeader.split(" ").length !== 2) {
    return res
      .status(403)
      .json({ success: false, code: 403, msg: "Please provide a valid token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, key);
    req.user = {
      ...decoded,
      role: ["testRole"], // You can modify or extend the role as needed
    };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, code: 401, msg: "Invalid token" });
  }
};

const isAuth = async (req, res, next) => {
  const authHeader = req.get("authorization");
  const workspaceId = req.params.workspaceId || req.body.workspaceId;
  if (!authHeader || authHeader.split(" ").length !== 2) {
    return res
      .status(403)
      .json({ success: false, code: 403, msg: "Please provide a valid token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, key);
    const roleDetails = await getRoleByUIDAndWID(decoded.userId, workspaceId);

    if (!roleDetails) {
      return res
        .status(401)
        .json({ success: false, code: 401, msg: "Unauthorized access!" });
    }

    req.user = {
      ...decoded,
      workspaceId: workspaceId,
      role: roleDetails.role, // You can modify or extend the role as needed
    };

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, code: 401, msg: "Unauthorized access!" });
  }
};

module.exports = { createToken, validateToken, isAuth };
