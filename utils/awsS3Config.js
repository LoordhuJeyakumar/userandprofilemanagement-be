const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const envProcessConfig = require("../config/config");

const s3Client = new S3Client({
  region: envProcessConfig.aws_region,
  credentials: {
    accessKeyId: envProcessConfig.aws_access_key,
    secretAccessKey: envProcessConfig.aws_secret_key,
  },
});

const uploadFile = async (file) => {
  const params = {
    Bucket: envProcessConfig.aws_S3_bucket,
    Key: `localIssues/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

module.exports = {
  uploadFile,
};
