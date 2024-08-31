// Import necessary models and utilities from their respective modules
const { ProfileModel, UserModel } = require("../models");
const { uploadFile } = require("../utils/awsS3Config");

// Define the profileController object that contains methods for handling profile-related operations
const profileController = {
  // This method retrieves a user's profile based on their userId
  getProfile: async (req, res) => {
    try {
      // Extract the userId from the request object, which is set after authentication
      const id = req?.userId;

      // Query the database to find the profile associated with the userId
      // Include related UserModel data (username, email, etc.) in the response
      const profile = await ProfileModel.findOne({
        where: { userId: id },
        include: {
          model: UserModel,
          attributes: ["username", "email", "isActive", "isVerified", "role"],
        },
      });

      // If no profile is found, send a 404 response with an error message
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // If the profile is found, send a 200 response with the profile data
      return res.status(200).json({
        message: "Profile fetched successfully",
        profile,
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // This method updates a user's profile with new data provided in the request body
  updateProfile: async (req, res) => {
    try {
      // Extract the authenticated user's data and the updated profile details from the request
      const user = req.user;
      const {
        firstName,
        lastName,
        phoneNumber,
        gender,
        profilePicture,
        dateOfBirth,
        address,
      } = req.body;

      // Find the profile associated with the user's ID
      const profile = await ProfileModel.findOne({
        where: { userId: user.id },
      });

      // If no profile is found, send a 404 response with an error message
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // Update the profile with the new data, retaining existing values if no new data is provided
      await profile.update({
        firstName: firstName || profile.firstName,
        lastName: lastName || profile.lastName,
        phoneNumber: phoneNumber || profile.phoneNumber,
        gender: gender || profile.gender,
        profilePicture: profilePicture || profile.profilePicture,
        dateOfBirth: dateOfBirth || profile.dateOfBirth,
        address: address || profile.address,
      });

      // Send a 200 response with a success message and the updated profile data
      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error) {
      // Log the error and handle specific Sequelize database errors (e.g., invalid input)
      console.log(error);
      //SequelizeDatabaseError

      if (error.name === "SequelizeDatabaseError") {
        return res.status(400).json({
          error: "Invalid input",
          errorMessage: error.parent.sqlMessage,
        });
      }
      // Send a 500 response for any other unexpected errors

      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // This method deletes a user's profile based on their userId
  deleteProfile: async (req, res) => {
    try {
      // Extract the userId from the request object
      const id = req.userId;

      // Find the profile associated with the user's ID
      const profile = await ProfileModel.findOne({
        where: { userId: id },
      });

      // If no profile is found, send a 404 response with an error message
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // Delete the profile from the database
      await profile.destroy();

      // Send a 200 response with a success message
      return res.status(200).json({
        message: "Profile deleted successfully",
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // This method updates a user's profile picture
  updateProfilePicture: async (req, res) => {
    try {
      // Extract the authenticated user's data and the new profile picture details from the request
      const user = req.user;
      const { profilePicture } = req.body;
      const file = req.file;

      // Find the profile associated with the user's ID
      const profile = await ProfileModel.findOne({
        where: { userId: user.id },
      });

      // If no profile is found, send a 404 response with an error message
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // If a profile picture URL is provided in the request body, update the profile with it
      if (profilePicture) {
        await profile.update({ profilePicture });
        return res.status(200).json({
          message: "Profile updated successfully",
          profilePicture: profilePicture,
        });
      }

      // If no file is uploaded, send a 400 response with an error message
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Upload the file to AWS S3 and get the file's URL
      const result = await uploadFile(file);
      const profilePictureUrl = result.Location;

      // Update the profile with the new profile picture URL from S3
      await profile.update({ profilePicture: profilePictureUrl });
      return res.status(200).json({
        message: "Profile picture updated successfully",
        profile,
      });
    } catch (error) {
      // Log the error and send a 500 response if an unexpected error occurs
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

// Export the profileController object to make it available for use in other parts of the application
module.exports = profileController;
