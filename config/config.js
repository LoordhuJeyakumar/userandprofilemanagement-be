// Load environment variables from a .env file
require("dotenv").config();

// Define configuration settings for different environments
const config = {
  development: {
    username: process.env.DB_USER || "root", // MySQL username for development
    password: process.env.DB_PASSWORD || "", // MySQL password for development
    database: process.env.DB_DATABASE || "user-management", // Database name for development
    host: process.env.DB_HOST || "127.0.0.1", // Database host for development
    port: process.env.DB_PORT || 3306, // Database port for development
    dialect: "mysql",
    jwtSecret: process.env.JWT_SECRET || "secret",
    server_port: process.env.PORT, // Server port
    email_host: process.env.EMAIL_HOST, // Email host
    email_user: process.env.EMAIL_USER, // Email user
    email_pass: process.env.EMAIL_PASS, // Email password
    email_port: process.env.EMAIL_PORT, // Email port
    email_secure: process.env.EMAIL_SECURE, // Email secure connection flag
    frontend_baseuri: process.env.FRONTEND_BASEURI, // Frontend base URI
    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
    aws_region: process.env.AWS_REGION,
    aws_S3_bucket: process.env.AWS_S3_BUCKET,
  },
  production: {
    username: process.env.DB_USER || "avnadmin", // MySQL username for production
    password: process.env.DB_PASSWORD || "", // MySQL password for production
    database: process.env.DB_DATABASE || "user-management", // Database name for production
    host:
      process.env.DB_HOST ||
      "user-management-mysql-aiven-user-profile-management-01.h.aivencloud.com", // Database host for production
    port: process.env.DB_PORT || 3306, // Database port for production
    dialect: "mysql", // Dialect for Sequelize (MySQL)
    jwtSecret: process.env.JWT_SECRET || "secret", // JWT secret key for token signing

    email_host: process.env.EMAIL_HOST, // Email host
    email_user: process.env.EMAIL_USER, // Email user
    email_pass: process.env.EMAIL_PASS, // Email password
    email_port: process.env.EMAIL_PORT, // Email port
    email_secure: process.env.EMAIL_SECURE, // Email secure connection flag
    frontend_baseuri: process.env.FRONTEND_BASEURI, // Frontend base URI

    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
    aws_region: process.env.AWS_REGION,
    aws_S3_bucket: process.env.AWS_S3_BUCKET,
  },
};

// Determine the current environment (development by default)
const env = process.env.NODE_ENV || "development";

// Select the configuration settings for the current environment
const envProcessConfig = config[env];

// Export the environment-specific configuration
module.exports = envProcessConfig;
