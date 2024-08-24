/* //Config env

require("dotenv").config();

const envConfig = {
  PORT: process.env.PORT || 3000,
  DB_DEV: {
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "nodejs",
  },
  DB_PROD: {
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "avnadmin",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "user-management",
  },
  JWT: {
    secret: process.env.JWT_SECRET || "secret",
  },
};

module.exports = envConfig;
 */
