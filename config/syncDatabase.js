const { sequelize } = require("../db");

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // Use `alter: true` to automatically adjust the schema to match the model.
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
}

module.exports = syncDatabase;
