// Import the UserModel and ProfileModel
const UserModel = require("./userModel");
const ProfileModel = require("./profileModel");

// Set up a one-to-one relationship between UserModel and ProfileModel.
// This means that each user can have one profile, and each profile is associated with one user.
UserModel.hasOne(ProfileModel, {
  foreignKey: "userId",
});

// Set up the inverse relationship, linking ProfileModel back to UserModel.
Profile.belongsTo(User, { foreignKey: "userId" });

// Export both models from this file so they can be used together in other parts of the application.
module.exports = {
  UserModel,
  ProfileModel,
};
