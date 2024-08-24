/* User Model */

// Import the DataTypes module from Sequelize, which provides various data types for defining model attributes.
const { DataTypes } = require("sequelize");
// Import the configured Sequelize instance from the index file.
const sequelize = require("../index");

// Define the User model with various fields and configurations.
const UserModel = sequelize.define(
  "User", // Name of the model
  {
    // Define the 'username' field as a non-nullable, unique string.
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      trim: true,
    },
    // Define the 'email' field as a non-nullable, unique, lowercase string with email validation.
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        isEmail: true, // Ensure the value is a valid email.
      },
    },
    // Define the 'password' field as a non-nullable string.
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Define the 'role' field as an ENUM with possible values 'user' and 'admin'. Default is 'user'.
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    // Define the 'isActive' field as a boolean with a default value of false.
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Define the 'isVerified' field as a boolean with a default value of false.
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Define the 'verificationToken' field as a string, allowing null values.
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Define the 'resetPasswordToken' field as a string, allowing null values.
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Define the 'resetPasswordExpires' field as a date, allowing null values.
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields to the model.
    timestamps: true,
    // Set the name of the table to 'users'.
    tableName: "users",
  }
);

// Export the UserModel so it can be used in other parts of the application.
module.exports = UserModel;
