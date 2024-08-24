const { Sequelize } = require("sequelize");
const envProcessConfig = require("./config/config");

// Destructure the necessary database connection details from the configuration
const { username, password, database, host, port, dialect } = envProcessConfig;

// Initialize a new Sequelize instance for connecting to the MySQL database
const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
});

// Function to establish a connection to the database with retry logic
const connectToDB = async (retryCount = 0) => {
  try {
    // Attempt to authenticate the connection
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);

    // Retry connection up to 3 times with a delay if it fails
    if (retryCount < 3) {
      console.log("Retrying connection...");
      retryCount++;
      setTimeout(() => connectToDB(retryCount), 3000); // Adding delay between retries
    } else {
      console.error("Maximum retry attempts reached. Exiting...");
      process.exit(1); // Exit the process if connection fails after maximum retries
    }
  }
};

module.exports = { sequelize, connectToDB };
