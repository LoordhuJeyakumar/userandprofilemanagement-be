//Set up mysql db with Sequelize

// Import the environment-specific configuration
const envProcessConfig = require("./config/config");
// Import the Express application
const app = require("./app");
const syncDatabase = require("./config/syncDatabase");
const { connectToDB } = require("./db");

// Set the server port from the environment configuration or default to 3000
const SERVER_PORT = envProcessConfig.SERVER_PORT || 3000;


connectToDB()
.then(() => {
  if (process.env.NODE_ENV !== "production") {
    syncDatabase();
  }

  app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
  });
})
.catch((error) => {
  console.error("Failed to connect to the database. Exiting...", error);
  process.exit(1);
});


// Exit the process if connection fails after maximum retries


// Initiate the database connection when the application starts
connectToDB();
