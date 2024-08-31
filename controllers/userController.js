// Importing necessary modules and configurations
const { UserModel, ProfileModel } = require("../models"); // User and Profile models from the models directory
const bcrypt = require("bcrypt"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for handling JSON Web Tokens
const envProcessConfig = require("../config/config"); // Configuration file for environment variables
const { validateEmail } = require("../utils/helper"); // Utility function to validate email format
const sendVerificationEmail = require("../utils/sendVerificationEmail"); // Function to send verification emails

// Async function to send a verification email to the user
async function sendEmail(userData, emailType) {
  try {
    // Call the sendVerificationEmail function with user data and email type
    const verificationEmail = await sendVerificationEmail(userData, emailType);

    console.log("Verification email sent successfully");
    return verificationEmail; // Return the email information if successful
  } catch (error) {
    console.error("Error sending verification email:", error);
    return error; // Return the error if sending fails
  }
}

// User controller containing various user-related operations
const userController = {
  // Function to handle user registration
  registerUser: async (req, res) => {
    try {
      // Extracting username, email, and password from the request body
      let { username, email, password } = req.body;

      // Validate input data
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Please provide username, email, and password" });
      }

      email = email.toLowerCase(); // Convert email to lowercase

      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" }); // Return an error if email format is invalid
      }

      // Check if a user with the same email already exists
      const existingUser = await UserModel.findOne({ where: { email } });

      if (existingUser) {
        let isVerified = existingUser.isVerified; // Check if the user is verified
        let isActive = existingUser.isActive; // Check if the user is active

        if (isVerified && isActive) {
          return res
            .status(400)
            .json({ error: `User with ${existingUser.email} already exists` }); // Return an error if the user is already verified and active
        }

        // Handle cases where the user is not verified or active
        if (!isVerified) {
          return res.status(400).json({
            error: `User with ${existingUser.email} is not verified, please verify your email`,
          });
        }
        if (!isActive) {
          return res.status(400).json({
            error: `User with ${existingUser.email} is not active, please contact admin`,
          });
        }
      }

      // Hash the user's password before saving
      const hashPassword = await bcrypt.hash(password, 10);

      // Generate a JWT token for email verification
      const verificationToken = jwt.sign(
        { email, username },
        envProcessConfig.jwtSecret,
        {
          expiresIn: "24h", // Token expires in 24 hours
        }
      );

      // Create a new user in the database
      const newUser = await UserModel.create({
        username,
        email,
        password: hashPassword,
        verificationToken,
      });

      // Create an associated profile for the user
      const newProfile = await ProfileModel.create({
        userId: newUser.id,
        firstName: newUser.username,
        lastName: "",
        address: "",
      });

      // Send a response indicating successful registration
      res.status(201).json({
        message: "User registered successfully, please verify your email",
        user: {
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      });

      // Send a verification email to the user
      let emailInfo = await sendEmail(newUser, "activationEmail");
      if (!emailInfo) {
        console.error("Error sending verification email"); // Log an error if the email fails to send
      }
      return;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" }); // Handle unexpected errors
    }
  },

  // Function to handle user login
  loginUser: async (req, res) => {
    try {
      let { email, password } = req.body;

      // Validate input data
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Please provide email and password" }); // Return an error if any field is missing
      }

      email = email.toLowerCase(); // Convert email to lowercase

      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" }); // Return an error if email format is invalid
      }

      // Check if a user with the given email exists
      const user = await UserModel.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: "User not found" }); // Return an error if the user does not exist
      }

      if (!user.isVerified) {
        return res
          .status(403)
          .json({ error: "User not verified, please verify your email!" }); // Return an error if the user is not verified
      }

      if (!user.isActive) {
        return res
          .status(403)
          .json({ error: "User is not active, please contact admin!" }); // Return an error if the user is not active
      }

      // Check if the provided password matches the stored password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" }); // Return an error if the password is incorrect
      }

      // Generate a JWT token for the authenticated user
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        envProcessConfig.jwtSecret,
        {
          expiresIn: "24h", // Token expires in 24 hours
        }
      );

      // Send a response indicating successful login
      return res.status(200).json({
        message: "Login successful",
        token,
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        expiresIn: 24 * 60 * 60, // Token expiration time in seconds
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    }
  },

  // Function to retrieve all users
  getAllUsers: async (req, res) => {
    try {
      // Fetch all users from the database, excluding sensitive fields
      const users = await UserModel.findAll({
        attributes: {
          exclude: ["password", "verificationToken", "resetPasswordToken"],
        },
      });

      // Send a response with the list of users
      return res.status(200).json({
        message: "Users fetched successfully",
        users,
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Function to retrieve details of a specific user
  getUserDetails: async (req, res) => {
    try {
      // Extract user ID from request
      const id = req.userId;

      // Fetch user details by primary key, excluding sensitive fields
      const user = await UserModel.findByPk(id, {
        attributes: {
          exclude: ["password", "verificationToken", "resetPasswordToken"],
        },
      });

      // Return an error if the user does not exist
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Send a response with the user details
      return res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Function to update user details
  updateUser: async (req, res) => {
    try {
      // Extract user ID from request
      const { id } = req.user;

      // Extract username and email from the request body
      const { username, email } = req.body;

      // Fetch the user by primary key
      const user = await UserModel.findByPk(id);

      // Return an error if the user does not exist
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update the user's username and email, if provided
      user.username = username || user.username;
      user.email = email || user.email;

      // Save the updated user data to the database
      await user.save();

      // Send a response indicating successful update
      return res.status(200).json({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Function to delete a user account
  deleteUser: async (req, res) => {
    try {
      // Extract user ID from request
      const { id } = req.params;

      // Fetch the user by primary key
      const user = await UserModel.findByPk(id);

      // Return an error if the user does not exist
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete the user from the database
      await user.destroy();

      // Send a response indicating successful deletion
      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Function to verify user email
  verifyUser: async (req, res) => {
    try {
      // Extract user ID and token from request parameters
      const { id, token } = req.params;
      console.log(id);

      // Check if the token is provided (Check link have token or not)
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      // Verify the JWT token and decode it
      const decoded = jwt.verify(token, envProcessConfig.jwtSecret);

      // Find the user by email from the decoded token
      const user = await UserModel.findOne({ where: { email: decoded.email } });

      // Return an error if the user does not exist
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return an error if the user is already verified and active
      if (user.isActive && user.isVerified) {
        return res.status(400).json({ error: "User already verified" });
      }

      // Check if the user ID matches the ID from the request
      if (user.id != id) {
        return res.status(400).json({ error: "Invalid token" });
      }

      // Check if the verification token matches the token from the request
      if (user.verificationToken != token) {
        return res.status(400).json({ error: "Invalid token" });
      }

      // Mark the user as verified and active, and clear the verification token
      user.isVerified = true;
      user.isActive = true;
      user.verificationToken = null;

      // Save the updated user to the database
      await user.save();

      // Return a success response
      return res.status(200).json({
        message: "User verified successfully",
      });
    } catch (error) {
      console.error(error);

      // Handle specific JWT errors
      //JsonWebTokenError: jwt malformed
      if (error.name === "JsonWebTokenError") {
        return res.status(400).json({ error: "Invalid token" });
      }
      // Log the error and send a 500 response if an unexpected error occurs
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  //Function to change password uding access token (if user logged in)
  changePassword: async (req, res) => {
    try {
      // Extract user ID from the request
      const { id } = req.user;
      // Extract old and new passwords from the request body
      const { oldPassword, newPassword } = req.body;

      // Check if both old and new passwords are provided
      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Please provide old password and new password" });
      }

      // Find the user by primary key
      const user = await UserModel.findByPk(id);

      // Return an error if the user does not exist
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Compare the provided old password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      // Return an error if the old password is invalid
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid old password" });
      }

      // Hash the new password
      const hashPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password with the new hashed password
      user.password = hashPassword;

      // Save the updated user to the database
      await user.save();

      // Return a success response
      return res.status(200).json({
        message: "Password changed successfully",
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Function to deactivate a user account
  deactivateUser: async (req, res) => {
    try {
      // Extract user ID from the request
      const { id } = req.user;

      // Find the user by primary key
      const user = await UserModel.findByPk(id);

      // Return an error if the user does not exist
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return an error if the user is already deactivated
      if (!user.isActive) {
        return res.status(400).json({ error: "User already deactivated" });
      }

      // Deactivate the user account
      user.isActive = false;

      // Save the updated user to the database
      await user.save();

      // Return a success response
      return res.status(200).json({
        message: "User deactivated successfully",
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Function to delete a user and their associated profile
  deleteUserAndProfile: async (req, res) => {
    try {
      // Extract user ID from the request
      const { id } = req.user;

      // Find the user by primary key
      const user = await UserModel.findByPk(id);

      // Return an error if the user does not exist
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the user's profile associated with the user ID
      const profile = await ProfileModel.findOne({ where: { userId: id } });

      // Return an error if the profile does not exist
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // Delete the user's profile
      await profile.destroy();

      // Delete the user account
      await user.destroy();

      // Return a success response
      return res.status(200).json({
        message: "User and associated profile deleted successfully",
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

// Export the userController object to make it available for use in other parts of the application
module.exports = userController;
