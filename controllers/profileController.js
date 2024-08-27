const { ProfileModel, UserModel } = require("../models");

const profileController = {
  getProfile: async (req, res) => {
    try {
      const id = req?.userId;

      const profile = await ProfileModel.findOne({
        where: { userId: id },
        include: {
          model: UserModel,
          attributes: ["username", "email"],
        },
      });

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      return res.status(200).json({
        message: "Profile fetched successfully",
        profile,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  updateProfile: async (req, res) => {
    try {
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

      const profile = await ProfileModel.findOne({
        where: { userId: user.id },
      });

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      await profile.update({
        firstName: firstName || profile.firstName,
        lastName: lastName || profile.lastName,
        phoneNumber: phoneNumber || profile.phoneNumber,
        gender: gender || profile.gender,
        profilePicture: profilePicture || profile.profilePicture,
        dateOfBirth: dateOfBirth || profile.dateOfBirth,
        address: address || profile.address,
      });

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error) {
      console.log(error);
      //SequelizeDatabaseError
      
      if (error.name === "SequelizeDatabaseError") {
        return res.status(400).json({ error: "Invalid input", errorMessage:error.parent.sqlMessage });
      }
    
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const id = req.userId;

      const profile = await ProfileModel.findOne({
        where: { userId: id },
      });

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      await profile.destroy();

      return res.status(200).json({
        message: "Profile deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = profileController;
