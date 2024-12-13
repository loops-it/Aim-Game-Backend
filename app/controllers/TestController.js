const testService = require("../services/TestService");

exports.testUpload = async (req, res, next) => {
  const { image } = req.body;
  try {
    const data = await testService.testUpload(image);
    res.status(201).json({ success: true, status: 201, data });
  } catch (error) {
    next(error);
  }
};
