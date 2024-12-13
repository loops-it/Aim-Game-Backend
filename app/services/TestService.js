const s3service = require("./s3Service");
const Test = require("../models/test");

exports.testUpload = async (image) => {
  const imageData = await s3service.upload(image, "users");
  const testData = await new Test({ image: imageData.Location }).save();
  return testData;
};
