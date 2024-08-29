const AWS = require("aws-sdk");
const envProcessConfig = require("../config/config");

const s3 = new AWS.S3({
  accessKeyId: envProcessConfig.aws_access_key,
  secretAccessKey: envProcessConfig.aws_secret_key,
  region: envProcessConfig.aws_region,
});

const uploadFile = (file) => {
  const params = {
    Bucket: envProcessConfig.aws_S3_bucket,
    Key: `localIssues/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
  };

  return s3.upload(params).promise();
};

module.exports = {
  uploadFile,
};
