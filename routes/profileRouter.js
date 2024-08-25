const profileController = require("../controllers/profileController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const profileRouter = require("express").Router();

profileRouter.get("/getProfile", authMiddleware, profileController.getProfile);
profileRouter.put(
  "/updateProfile",
  authMiddleware,
  profileController.updateProfile
);
profileRouter.delete(
  "/deleteProfile",
  authMiddleware,
  profileController.deleteProfile
);

module.exports = profileRouter;
