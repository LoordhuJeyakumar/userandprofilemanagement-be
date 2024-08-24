/* Profile Model */

//Import the DataTypes module from Sequelize.
import { DataTypes } from "sequelize";
import { sequelize } from "../db";

// Define the Profile model with various fields and configurations.
const ProfileModel = sequelize.define(
  "Profile", // Name of the model
  {
    // Define the 'firstName' field as a non-nullable string.
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Define the 'lastName' field as a non-nullable string.
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Define the 'phoneNumber' field as a non-nullable string.
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Define the 'gender' field as an ENUM with possible values 'male', 'female', and 'other'.
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: false,
    },
    // Define the 'profilePicture' field as a string, allowing null values.
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Define the 'dateOfBirth' field as a non-nullable date (only date, no time).
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Define the 'address' field as a non-nullable string.
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Define the 'userId' field as an integer, referencing the 'id' field in the 'users' table.
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      allowNull: false,
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields to the model.
    timestamps: true,
    // Set the name of the table to 'profiles'.
    tableName: "profiles",
  }
);
// Export the ProfileModel so it can be used in other parts of the application.
module.exports = ProfileModel;
